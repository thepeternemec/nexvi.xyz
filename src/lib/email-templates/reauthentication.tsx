import * as React from 'react'

import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components'

interface ReauthenticationEmailProps {
  token: string
}

const PRIMARY = '#4F46E5'
const FOREGROUND = '#0B0B12'
const MUTED = '#55575d'
const FOOTER = '#6b7280'
const SURFACE = '#f8fafc'
const BORDER = '#e2e8f0'

export const ReauthenticationEmail = ({ token }: ReauthenticationEmailProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Your verification code</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={brand}>
          <span style={brandLink}>
            <span style={brandDot} />
            <span style={brandName}>nexvi</span>
          </span>
        </Section>

        <Heading style={h1}>Confirm reauthentication</Heading>
        <Text style={text}>Use the code below to confirm your identity:</Text>
        <Text style={codeStyle}>{token}</Text>


        <Text style={footer}>
          This code will expire shortly. If you didn't request this, you can
          safely ignore this email.
        </Text>

        <Text style={footer}>
          nexvi — AI that turns your experience into better job applications.
        </Text>
      </Container>
    </Body>
  </Html>
)

export default ReauthenticationEmail

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
const codeStyle = {
  fontFamily: 'Courier, monospace',
  fontSize: '28px',
  fontWeight: 600,
  letterSpacing: '0.12em',
  color: FOREGROUND,
  margin: '0 0 28px',
  padding: '18px 24px',
  backgroundColor: SURFACE,
  border: `1px solid ${BORDER}`,
  borderRadius: '12px',
  display: 'inline-block',
}
const footer = {
  fontSize: '13px',
  color: FOOTER,
  lineHeight: '1.5',
  margin: '28px 0 0',
}
