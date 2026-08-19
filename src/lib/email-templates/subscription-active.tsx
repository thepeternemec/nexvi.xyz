import * as React from 'react'

import { Button, Text } from '@react-email/components'

import type { TemplateEntry } from './registry'
import { EmailShell, SITE_URL, button, footer, list, text } from './_shell'

interface Props {
  name?: string
  planLabel?: string
  amountLabel?: string
  renewsOn?: string
}

const SubscriptionActiveEmail = ({ name, planLabel, amountLabel, renewsOn }: Props) => (
  <EmailShell
    preview="Your Nexvi Premium plan is active"
    heading={name ? `You're on Premium, ${name}` : "You're on Premium"}
  >
    <Text style={text}>
      Thanks for subscribing. {planLabel ?? 'Nexvi Premium'}
      {amountLabel ? ` (${amountLabel})` : ''} is active on your account right now.
    </Text>
    <Text style={list}>
      · Unlimited CV and cover letter generation
      <br />· Unlimited ATS scoring and AI Humanizer
      <br />· Full prompt library and prompt packs
      <br />· Unlimited Copilot workspace and saved CVs
      <br />· Unlimited PDF exports
    </Text>
    {renewsOn ? <Text style={text}>Your plan renews on {renewsOn}.</Text> : null}

    <Button style={button} href={`${SITE_URL}/copilot`}>
      Open Copilot
    </Button>

    <Text style={footer}>
      Manage or cancel anytime at {SITE_URL}/subscription. Questions? Reply to this email — it
      reaches us at info@nexvi.xyz.
    </Text>
  </EmailShell>
)

export const template = {
  component: SubscriptionActiveEmail,
  subject: 'Your Nexvi Premium plan is active',
  displayName: 'Subscription confirmation',
  previewData: {
    name: 'Peter',
    planLabel: 'Premium monthly',
    amountLabel: '$7 / month',
    renewsOn: '18 September 2026',
  },
} satisfies TemplateEntry

export default SubscriptionActiveEmail
