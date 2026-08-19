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

interface EmailChangeEmailProps {
  siteName: string
  oldEmail: string
  email: string
  newEmail: string
  confirmationUrl: string
}

const PRIMARY = '#4F46E5'
const FOREGROUND = '#0B0B12'
const MUTED = '#55575d'
const FOOTER = '#6b7280'
const SURFACE = '#f8fafc'
const BORDER = '#e2e8f0'

export const EmailChangeEmail = ({
  siteName,
  oldEmail,
  newEmail,
  confirmationUrl,
}: EmailChangeEmailProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Confirm your email change for {siteName}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={brand}>
          <span style={brandLink}>
            <span style={brandDot} />
            <span style={brandName}>nexvi</span>
          </span>
        </Section>

        <Heading style={h1}>Confirm your email change</Heading>
        <Text style={text}>
          You requested to change your email address for {siteName} from{' '}
          <Link href={`mailto:${oldEmail}`} style={link}>
            {oldEmail}
          </Link>{' '}
          to{' '}
          <Link href={`mailto:${newEmail}`} style={link}>
            {newEmail}
          </Link>
          .
        </Text>
        <Text style={text}>
          Click the button below to confirm this change:
        </Text>
        <Button style={button} href={confirmationUrl}>
          Confirm Email Change
        </Button>

        <Text style={fallback}>
          If the button doesn’t work, paste this link into your browser:
          <br />
          <Link href={confirmationUrl} style={linkBlock}>
            {confirmationUrl}
          </Link>
        </Text>


        <Text style={footer}>
          If you didn't request this change, please secure your account
          immediately.
        </Text>
      </Container>
    </Body>
  </Html>
)

export default EmailChangeEmail

const main = {
  backgroundColor: '#ffffff',
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
const footer = {
  fontSize: '13px',
  color: FOOTER,
  lineHeight: '1.5',
  margin: '28px 0 0',
}
