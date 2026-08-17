import * as React from 'react'

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components'

interface SignupEmailProps {
  siteName: string
  siteUrl: string
  recipient: string
  confirmationUrl: string
}

const PRIMARY = '#4F46E5'
const FOREGROUND = '#0B0B12'
const MUTED = '#55575d'
const FOOTER = '#6b7280'
const SURFACE = '#f8fafc'
const BORDER = '#e2e8f0'

export const SignupEmail = ({
  siteName,
  siteUrl,
  recipient,
  confirmationUrl,
}: SignupEmailProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Confirm your email for {siteName}</Preview>
    <Body style={main}>
      <Container style={container}>
        {/* Brand header */}
        <Section style={brand}>
          <Link href={siteUrl} style={brandLink}>
            <span style={brandDot} />
            <span style={brandName}>{siteName}</span>
          </Link>
        </Section>

        <Heading style={h1}>Confirm your email</Heading>
        <Text style={text}>
          Thanks for signing up for{' '}
          <Link href={siteUrl} style={link}>
            <strong>{siteName}</strong>
          </Link>
          !
        </Text>
        <Text style={text}>
          Please confirm your email address (
          <Link href={`mailto:${recipient}`} style={link}>
            {recipient}
          </Link>
          ) by clicking the button below:
        </Text>
        <Button style={button} href={confirmationUrl}>
          Verify Email
        </Button>

        <Text style={fallback}>
          If the button doesn’t work, paste this link into your browser:
          <br />
          <Link href={confirmationUrl} style={linkBlock}>
            {confirmationUrl}
          </Link>
        </Text>

        {/* Deliverability tip */}
        <Section style={tipBox}>
          <Text style={tipTitle}>Didn’t receive this email?</Text>
          <Text style={tipText}>
            Check your spam, junk, or promotions folder. To make sure you never
            miss an update, add{' '}
            <Link href="mailto:noreply@notify.applywise.eu" style={tipLink}>
              noreply@notify.applywise.eu
            </Link>{' '}
            to your contacts.
          </Text>
        </Section>

        <Text style={footer}>
          If you didn’t create an account, you can safely ignore this email.
        </Text>
      </Container>
    </Body>
  </Html>
)

export default SignupEmail

const main = {
  backgroundColor: SURFACE,
  fontFamily: '"Manrope", "Helvetica Neue", Helvetica, Arial, sans-serif',
  padding: '40px 0',
}
const container = {
  backgroundColor: '#ffffff',
  borderRadius: '16px',
  border: `1px solid ${BORDER}`,
  padding: '40px',
  maxWidth: '480px',
  margin: '0 auto',
}
const brand = { marginBottom: '28px' }
const brandLink = {
  display: 'inline-flex',
  alignItems: 'center',
  textDecoration: 'none',
  color: FOREGROUND,
}
const brandDot = {
  display: 'inline-block',
  width: '10px',
  height: '10px',
  borderRadius: '9999px',
  backgroundColor: PRIMARY,
  marginRight: '10px',
}
const brandName = {
  fontSize: '18px',
  fontWeight: 600,
  letterSpacing: '-0.02em',
  fontFamily: '"Sora", "Manrope", "Helvetica Neue", Helvetica, Arial, sans-serif',
}
const h1 = {
  fontSize: '24px',
  fontWeight: 600,
  color: FOREGROUND,
  margin: '0 0 20px',
  letterSpacing: '-0.02em',
  fontFamily: '"Sora", "Manrope", "Helvetica Neue", Helvetica, Arial, sans-serif',
}
const text = {
  fontSize: '15px',
  color: MUTED,
  lineHeight: '1.6',
  margin: '0 0 20px',
}
const link = { color: PRIMARY, textDecoration: 'underline' }
const linkBlock = {
  color: PRIMARY,
  textDecoration: 'none',
  wordBreak: 'break-all' as const,
  display: 'inline-block',
  marginTop: '6px',
}
const button = {
  backgroundColor: PRIMARY,
  color: '#ffffff',
  fontSize: '15px',
  fontWeight: 600,
  borderRadius: '9999px',
  padding: '14px 28px',
  textDecoration: 'none',
  display: 'inline-block',
  marginBottom: '8px',
}
const fallback = {
  fontSize: '13px',
  color: FOOTER,
  lineHeight: '1.5',
  margin: '24px 0 0',
}
const tipBox = {
  backgroundColor: SURFACE,
  border: `1px solid ${BORDER}`,
  borderRadius: '12px',
  padding: '18px 20px',
  marginTop: '28px',
}
const tipTitle = {
  fontSize: '13px',
  fontWeight: 600,
  color: FOREGROUND,
  margin: '0 0 6px',
}
const tipText = {
  fontSize: '13px',
  color: MUTED,
  lineHeight: '1.5',
  margin: '0',
}
const tipLink = { color: PRIMARY, textDecoration: 'underline' }
const footer = {
  fontSize: '13px',
  color: FOOTER,
  lineHeight: '1.5',
  margin: '28px 0 0',
}
