import * as React from 'react'

import { Button, Text } from '@react-email/components'

import type { TemplateEntry } from './registry'
import { EmailShell, SITE_URL, button, footer, text } from './_shell'

interface Props {
  name?: string
  amountLabel?: string
  retryOn?: string
}

const PaymentFailedEmail = ({ name, amountLabel, retryOn }: Props) => (
  <EmailShell
    preview="We couldn't take your Nexvi payment"
    heading={name ? `Payment problem, ${name}` : 'We couldn’t take your payment'}
  >
    <Text style={text}>
      Your card was declined{amountLabel ? ` for ${amountLabel}` : ''}, so your Nexvi Premium
      renewal didn't go through.
    </Text>
    <Text style={text}>
      {retryOn
        ? `We'll try again on ${retryOn}. Update your card before then to keep unlimited access.`
        : 'Update your card to keep unlimited access — we retry automatically for a few days before the plan lapses.'}
    </Text>

    <Button style={button} href={`${SITE_URL}/subscription`}>
      Update payment method
    </Button>

    <Text style={footer}>
      Already fixed it? You can ignore this email. Need a hand? Reply here — info@nexvi.xyz.
    </Text>
  </EmailShell>
)

export const template = {
  component: PaymentFailedEmail,
  subject: 'Action needed: your Nexvi payment failed',
  displayName: 'Payment failed',
  previewData: { name: 'Peter', amountLabel: '$7.00', retryOn: '22 August 2026' },
} satisfies TemplateEntry

export default PaymentFailedEmail
