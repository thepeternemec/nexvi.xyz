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

import type { TemplateEntry } from './registry'

interface WelcomeEmailProps {
  name?: string
}

const SITE_NAME = 'Nexvi'
const SITE_URL = 'https://nexvi.xyz'

const PRIMARY = '#4F46E5'
const FOREGROUND = '#0B0B12'
const MUTED = '#55575d'
const FOOTER = '#6b7280'
const BORDER = '#e2e8f0'

const WelcomeEmail = ({ name }: WelcomeEmailProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Welcome to {SITE_NAME} — turn your experience into better job applications</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={brand}>
          <Link href={SITE_URL} style={brandLink}>
            <span style={brandDot} />
            <span style={brandName}>nexvi</span>
          </Link>
        </Section>

        <Heading style={h1}>{name ? `Welcome, ${name}` : 'Welcome to Nexvi'}</Heading>
        <Text style={text}>
          Nexvi is the AI layer between your experience and a specific job description —
          rewriting, scoring and humanizing your application so it survives the ATS and
          reads like you at your best.
        </Text>
        <Text style={text}>Here’s the fastest way to start:</Text>
        <Text style={list}>
          1. Paste a job description into Copilot
          <br />
          2. Add your CV or background once — we keep it in your workspace
          <br />
          3. Generate a tailored CV, cover letter and ATS score
        </Text>

        <Button style={button} href={`${SITE_URL}/copilot`}>
          Open Copilot
        </Button>

        <Text style={footer}>
          Questions? Just reply to this email — it reaches us at info@nexvi.xyz.
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: WelcomeEmail,
  subject: 'Welcome to Nexvi',
  displayName: 'Welcome email',
  previewData: { name: 'Peter' },
} satisfies TemplateEntry

export default WelcomeEmail

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
const list = {
  fontSize: '15px',
  color: MUTED,
  lineHeight: '1.9',
  margin: '0 0 28px',
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
}
const footer = {
  fontSize: '13px',
  color: FOOTER,
  lineHeight: '1.5',
  margin: '28px 0 0',
}
