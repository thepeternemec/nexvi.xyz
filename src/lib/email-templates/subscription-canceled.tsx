import * as React from 'react'

import { Button, Text } from '@react-email/components'

import type { TemplateEntry } from './registry'
import { EmailShell, SITE_URL, button, footer, text } from './_shell'

interface Props {
  name?: string
  accessUntil?: string
}

const SubscriptionCanceledEmail = ({ name, accessUntil }: Props) => (
  <EmailShell
    preview="Your Nexvi Premium plan has been canceled"
    heading={name ? `Your plan is canceled, ${name}` : 'Your plan is canceled'}
  >
    <Text style={text}>
      We've canceled your Nexvi Premium subscription — you won't be charged again.
    </Text>
    <Text style={text}>
      {accessUntil
        ? `You keep full Premium access until ${accessUntil}. After that your account moves to the Free plan, and your documents, saved prompts and CV stay in your workspace.`
        : 'Your account moves to the Free plan. Your documents, saved prompts and CV stay in your workspace.'}
    </Text>

    <Button style={button} href={`${SITE_URL}/pricing`}>
      Reactivate Premium
    </Button>

    <Text style={footer}>
      Changed your mind or canceled by accident? Reply to this email and we'll sort it out —
      info@nexvi.xyz.
    </Text>
  </EmailShell>
)

export const template = {
  component: SubscriptionCanceledEmail,
  subject: 'Your Nexvi Premium plan has been canceled',
  displayName: 'Cancellation confirmation',
  previewData: { name: 'Peter', accessUntil: '18 September 2026' },
} satisfies TemplateEntry

export default SubscriptionCanceledEmail
