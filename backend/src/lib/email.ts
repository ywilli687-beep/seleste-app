import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendAuditReadyEmail({
  to,
  businessName,
  domain,
  score,
  grade,
  gradeLabel,
  topIssue,
  reportSlug,
}: {
  to: string
  businessName: string | null
  domain: string
  score: number
  grade: string
  gradeLabel: string
  topIssue: string
  reportSlug: string | null
}) {
  const displayName = businessName ?? domain
  const reportUrl = reportSlug
    ? `${process.env.FRONTEND_URL}/report/${reportSlug}`
    : `${process.env.FRONTEND_URL}/dashboard`

  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL || 'reports@seleste.io',
    to,
    subject: `Your website scored a ${grade} — here's what to fix first`,
    html: auditReadyTemplate({ displayName, domain, score, grade, gradeLabel, topIssue, reportUrl }),
  })
}

export async function sendMonthlyScoreEmail({
  to,
  businessName,
  domain,
  score,
  grade,
  previousScore,
  reportSlug,
}: {
  to: string
  businessName: string | null
  domain: string
  score: number
  grade: string
  previousScore: number | null
  reportSlug: string | null
}) {
  const displayName = businessName ?? domain
  const reportUrl = reportSlug
    ? `${process.env.FRONTEND_URL}/report/${reportSlug}`
    : `${process.env.FRONTEND_URL}/dashboard`
  const delta = previousScore !== null ? score - previousScore : null

  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL || 'reports@seleste.io',
    to,
    subject: `${displayName} — your monthly website score`,
    html: monthlyScoreTemplate({ displayName, domain, score, grade, delta, reportUrl }),
  })
}

function auditReadyTemplate({
  displayName, domain, score, grade, gradeLabel, topIssue, reportUrl
}: {
  displayName: string
  domain: string
  score: number
  grade: string
  gradeLabel: string
  topIssue: string
  reportUrl: string
}): string {
  const scoreColor = score >= 75 ? '#4ade80' : score >= 60 ? '#c8a96e' : score >= 45 ? '#fbbf24' : '#f87171'

  return `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#0a0a0f;font-family:Georgia,serif;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr><td align="center" style="padding:40px 20px;">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#111118;border-radius:12px;overflow:hidden;border:1px solid #1c1c24;">

        <tr><td style="padding:40px 40px 0;">
          <p style="margin:0;font-family:monospace;font-size:12px;color:#8a857e;letter-spacing:.08em;text-transform:uppercase;">SELESTE AUDIT REPORT</p>
          <h1 style="margin:12px 0 0;font-size:28px;color:#f4f1ec;font-weight:400;">${displayName}</h1>
          <p style="margin:4px 0 0;font-size:13px;color:#8a857e;">${domain}</p>
        </td></tr>

        <tr><td style="padding:32px 40px;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="width:120px;text-align:center;background:#181825;border-radius:8px;padding:24px;border:1px solid rgba(255,255,255,0.05);">
                <div style="font-size:52px;font-weight:400;color:${scoreColor};line-height:1;">${score}</div>
                <div style="font-size:13px;color:#8a857e;margin-top:2px;">/ 100</div>
                <div style="font-size:22px;color:${scoreColor};margin-top:8px;font-weight:600;">${grade}</div>
              </td>
              <td style="padding-left:24px;vertical-align:middle;">
                <p style="margin:0 0 8px;font-size:16px;color:#c8a96e;font-weight:600;">${gradeLabel}</p>
                <p style="margin:0;font-size:14px;color:#c4bfb8;line-height:1.6;">Your website growth intelligence audit is complete. Here's a critical finding to address:</p>
              </td>
            </tr>
          </table>
        </td></tr>

        <tr><td style="padding:0 40px 32px;">
          <div style="background:#1c1c24;border-left:3px solid #f87171;border-radius:0 8px 8px 0;padding:20px;">
            <p style="margin:0 0 6px;font-size:11px;color:#8a857e;text-transform:uppercase;letter-spacing:.08em;font-weight:700;">Critical Revenue Leak Found</p>
            <p style="margin:0;font-size:14px;color:#f4f1ec;line-height:1.5;">${topIssue}</p>
          </div>
        </td></tr>

        <tr><td style="padding:0 40px 48px;">
          <a href="${reportUrl}" style="display:block;background:#c8a96e;color:#0a0a0f;text-decoration:none;text-align:center;padding:16px 28px;border-radius:8px;font-family:Arial,sans-serif;font-size:15px;font-weight:700;letter-spacing:0.02em;">
            VIEW FULL GROWTH ROADMAP →
          </a>
          <p style="margin:20px 0 0;font-size:12px;color:#8a857e;text-align:center;line-height:1.5;">
            Unlock all 47 specific checks and your prioritized 90-day action plan.
          </p>
        </td></tr>

        <tr><td style="padding:24px 40px;background:#0d0d14;border-top:1px solid rgba(255,255,255,0.05);">
          <p style="margin:0;font-size:11px;color:#8a857e;text-align:center;letter-spacing:0.04em;">
            SENT BY SELESTE AGENTIC GROW INTELLIGENCE · <a href="${process.env.FRONTEND_URL}" style="color:#c8a96e;text-decoration:none;">SELESTE.IO</a>
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`
}

function monthlyScoreTemplate({
  displayName, domain, score, grade, delta, reportUrl
}: {
  displayName: string
  domain: string
  score: number
  grade: string
  delta: number | null
  reportUrl: string
}): string {
  const scoreColor = score >= 75 ? '#4ade80' : score >= 60 ? '#c8a96e' : '#f87171'
  const deltaStr = delta === null ? '' : delta > 0 ? `↑ ${delta} points improvement` : delta < 0 ? `↓ ${Math.abs(delta)} points decrease` : 'Stable since last month'
  const deltaColor = delta === null ? '' : delta > 0 ? '#4ade80' : delta < 0 ? '#f87171' : '#8a857e'

  return `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#0a0a0f;font-family:Georgia,serif;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr><td align="center" style="padding:40px 20px;">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#111118;border-radius:12px;overflow:hidden;border:1px solid #1c1c24;">

        <tr><td style="padding:40px 40px 0;">
          <p style="margin:0;font-family:monospace;font-size:12px;color:#8a857e;letter-spacing:.08em;text-transform:uppercase;">MONTHLY SCORE RECAP</p>
          <h1 style="margin:12px 0 0;font-size:28px;color:#f4f1ec;font-weight:400;">${displayName}</h1>
          <p style="margin:4px 0 0;font-size:13px;color:#8a857e;">${domain}</p>
        </td></tr>

        <tr><td style="padding:32px 40px;">
          <div style="text-align:center;background:#181825;border-radius:12px;padding:32px;border:1px solid rgba(255,255,255,0.05);">
            <div style="font-size:68px;color:${scoreColor};line-height:1;font-weight:400;">${score}</div>
            <div style="font-size:24px;color:${scoreColor};margin:4px 0;font-weight:600;">Grade ${grade}</div>
            ${delta !== null ? `<div style="font-size:13px;color:${deltaColor};margin-top:12px;font-family:Arial,sans-serif;font-weight:600;">${deltaStr}</div>` : ''}
          </div>
        </td></tr>

        <tr><td style="padding:0 40px 48px;">
          <a href="${reportUrl}" style="display:block;background:#c8a96e;color:#0a0a0f;text-decoration:none;text-align:center;padding:16px 28px;border-radius:8px;font-family:Arial,sans-serif;font-size:15px;font-weight:700;letter-spacing:0.02em;">
            VIEW CURRENT GROWTH PLAN →
          </a>
          <p style="margin:20px 0 0;font-size:12px;color:#8a857e;text-align:center;">
            Log in to see this month's prioritized growth targets.
          </p>
        </td></tr>

        <tr><td style="padding:24px 40px;background:#0d0d14;border-top:1px solid rgba(255,255,255,0.05);">
          <p style="margin:0;font-size:11px;color:#8a857e;text-align:center;letter-spacing:0.04em;">
            SENT BY SELESTE AGENTIC GROW INTELLIGENCE · <a href="${process.env.FRONTEND_URL}" style="color:#c8a96e;text-decoration:none;">SELESTE.IO</a>
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`
}
