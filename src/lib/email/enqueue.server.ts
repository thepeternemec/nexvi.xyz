import * as React from 'react'
import { render } from '@react-email/render'
import { createClient } from '@supabase/supabase-js'

import { TEMPLATES } from '@/lib/email-templates/registry'

const SITE_NAME = 'Nexvi'
const SENDER_DOMAIN = 'notify.nexvi.xyz'
const FROM_DOMAIN = 'nexvi.xyz'

function redactEmail(email?: string | null): string {
  if (!email) return '***'
  const [local, domain] = email.split('@')
  if (!local || !domain) return '***'
  return `${local[0]}***@${domain}`
}

function generateToken(): string {
  const bytes = new Uint8Array(32)
  crypto.getRandomValues(bytes)
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

function admin() {
  return createClient(
    process.env['SUPABASE_URL']!,
    process.env['SUPABASE_SERVICE_ROLE_KEY']!,
  )
}

/**
 * Server-side (no user session) transactional email send — used by webhooks and
 * other backend flows. Mirrors /lovable/email/transactional/send: suppression
 * check, unsubscribe token, render, enqueue.
 */
export async function enqueueTransactionalEmail(input: {
  templateName: string
  recipientEmail: string
  idempotencyKey?: string
  templateData?: Record<string, unknown>
}): Promise<{ success: boolean; reason?: string }> {
  const template = TEMPLATES[input.templateName]
  if (!template) {
    console.error('Template not found in registry', { templateName: input.templateName })
    return { success: false, reason: 'template_not_found' }
  }

  const recipient = template.to || input.recipientEmail
  if (!recipient) return { success: false, reason: 'missing_recipient' }

  const supabase = admin()
  const messageId = crypto.randomUUID()
  const idempotencyKey = input.idempotencyKey || messageId
  const normalizedEmail = recipient.toLowerCase()

  const { data: suppressed, error: suppressionError } = await supabase
    .from('suppressed_emails')
    .select('id')
    .eq('email', normalizedEmail)
    .maybeSingle()

  if (suppressionError) {
    console.error('Suppression check failed — refusing to send', {
      message: suppressionError.message,
      recipient_redacted: redactEmail(recipient),
    })
    return { success: false, reason: 'suppression_check_failed' }
  }
  if (suppressed) {
    await supabase.from('email_send_log').insert({
      message_id: messageId,
      template_name: input.templateName,
      recipient_email: recipient,
      status: 'suppressed',
    })
    return { success: false, reason: 'email_suppressed' }
  }

  // Resolve (or create) the unsubscribe token for this address.
  let unsubscribeToken: string
  const { data: existingToken } = await supabase
    .from('email_unsubscribe_tokens')
    .select('token, used_at')
    .eq('email', normalizedEmail)
    .maybeSingle()

  if (existingToken?.token && !existingToken.used_at) {
    unsubscribeToken = existingToken.token as string
  } else if (!existingToken) {
    const fresh = generateToken()
    await supabase
      .from('email_unsubscribe_tokens')
      .upsert({ token: fresh, email: normalizedEmail }, { onConflict: 'email', ignoreDuplicates: true })
    const { data: stored } = await supabase
      .from('email_unsubscribe_tokens')
      .select('token')
      .eq('email', normalizedEmail)
      .maybeSingle()
    if (!stored?.token) return { success: false, reason: 'token_unavailable' }
    unsubscribeToken = stored.token as string
  } else {
    // Token already used but address not suppressed — do not send.
    return { success: false, reason: 'email_suppressed' }
  }

  const element = React.createElement(template.component, input.templateData ?? {})
  const html = await render(element)
  const plainText = await render(element, { plainText: true })
  const subject =
    typeof template.subject === 'function'
      ? template.subject((input.templateData ?? {}) as Record<string, any>)
      : template.subject

  await supabase.from('email_send_log').insert({
    message_id: messageId,
    template_name: input.templateName,
    recipient_email: recipient,
    status: 'pending',
  })

  const { error: enqueueError } = await supabase.rpc('enqueue_email', {
    queue_name: 'transactional_emails',
    payload: {
      message_id: messageId,
      to: recipient,
      from: `${SITE_NAME} <info@${FROM_DOMAIN}>`,
      sender_domain: SENDER_DOMAIN,
      subject,
      html,
      text: plainText,
      purpose: 'transactional',
      label: input.templateName,
      idempotency_key: idempotencyKey,
      unsubscribe_token: unsubscribeToken,
      queued_at: new Date().toISOString(),
    },
  })

  if (enqueueError) {
    console.error('Failed to enqueue email', {
      message: enqueueError.message,
      templateName: input.templateName,
      recipient_redacted: redactEmail(recipient),
    })
    await supabase.from('email_send_log').insert({
      message_id: messageId,
      template_name: input.templateName,
      recipient_email: recipient,
      status: 'failed',
      error_message: 'Failed to enqueue email',
    })
    return { success: false, reason: 'enqueue_failed' }
  }

  return { success: true }
}
