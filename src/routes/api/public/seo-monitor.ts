import { createFileRoute } from '@tanstack/react-router'

/**
 * Automated SEO monitoring endpoint.
 * Called by the scheduled job (and by the post-deploy hook) to re-run
 * robots.txt / sitemap / canonical / schema checks and alert on breakage.
 */
export const Route = createFileRoute('/api/public/seo-monitor')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const expected = process.env['SUPABASE_PUBLISHABLE_KEY']
        const provided = request.headers.get('apikey') ?? request.headers.get('authorization')?.replace('Bearer ', '')
        if (!expected || provided !== expected) {
          return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
          })
        }

        let triggerSource = 'cron'
        try {
          const body = (await request.json()) as { source?: string }
          if (typeof body?.source === 'string') triggerSource = body.source.slice(0, 32)
        } catch {
          // empty body is fine
        }

        const { runAndRecordSeoChecks } = await import('@/lib/seo-monitor-runner.server')
        const run = await runAndRecordSeoChecks(triggerSource)

        return new Response(
          JSON.stringify({
            status: run.status,
            passed: run.passed,
            warned: run.warned,
            failed: run.failed,
            alerted: run.alerted,
            failing: run.checks.filter((c) => c.status === 'fail'),
          }),
          { headers: { 'Content-Type': 'application/json' } },
        )
      },
    },
  },
})
