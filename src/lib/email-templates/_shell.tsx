import * as React from 'react'

import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
} from '@react-email/components'

export const SITE_NAME = 'Nexvi'
export const SITE_URL = 'https://nexvi.xyz'

export const PRIMARY = '#4F46E5'
export const FOREGROUND = '#0B0B12'
export const MUTED = '#55575d'
export const FOOTER_COLOR = '#6b7280'
export const BORDER = '#e2e8f0'

export const main = {
  backgroundColor: '#ffffff',
  fontFamily: '"Manrope", "Helvetica Neue", Helvetica, Arial, sans-serif',
  padding: '40px 0',
}
export const container = {
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
export const h1 = {
  fontSize: '24px',
  fontWeight: 600,
  color: FOREGROUND,
  margin: '0 0 20px',
  letterSpacing: '-0.02em',
  fontFamily: '"Sora", "Manrope", "Helvetica Neue", Helvetica, Arial, sans-serif',
}
export const text = {
  fontSize: '15px',
  color: MUTED,
  lineHeight: '1.6',
  margin: '0 0 20px',
}
export const list = {
  fontSize: '15px',
  color: MUTED,
  lineHeight: '1.9',
  margin: '0 0 28px',
}
export const button = {
  backgroundColor: PRIMARY,
  color: '#ffffff',
  fontSize: '15px',
  fontWeight: 600,
  borderRadius: '9999px',
  padding: '14px 28px',
  textDecoration: 'none',
  display: 'inline-block',
}
export const footer = {
  fontSize: '13px',
  color: FOOTER_COLOR,
  lineHeight: '1.5',
  margin: '28px 0 0',
}

/** Shared nexvi-branded email shell: white card, indigo dot wordmark. */
export function EmailShell({
  preview,
  heading,
  children,
}: {
  preview: string
  heading: string
  children: React.ReactNode
}) {
  return (
    <Html lang="en" dir="ltr">
      <Head />
      <Preview>{preview}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={brand}>
            <Link href={SITE_URL} style={brandLink}>
              <span style={brandDot} />
              <span style={brandName}>nexvi</span>
            </Link>
          </Section>
          <Heading style={h1}>{heading}</Heading>
          {children}
        </Container>
      </Body>
    </Html>
  )
}
