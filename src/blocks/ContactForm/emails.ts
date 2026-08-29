const BRAND_GREEN = '#007A63'

type SubmissionData = {
  formType: 'quote' | 'contact' | 'storeSignup'
  name: string
  firstName?: string
  lastName?: string
  email: string
  phone?: string
  organization?: string
  productInterest?: string
  productColor?: string
  quantity?: string
  inHandsDate?: string
  businessName?: string
  storePlatform?: string
  message?: string
}

const STORE_PLATFORM_LABELS: Record<string, string> = {
  basic: 'Free — 10 Product Limit',
  pro: 'Pro — Unlimited Categories & SKUs ($249)',
}

function escapeHtml(str: string) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function row(label: string, value?: string) {
  if (!value) return ''
  return `
    <tr>
      <td style="padding:6px 0;font-size:13px;color:#666;width:150px;vertical-align:top;">${label}</td>
      <td style="padding:6px 0;font-size:14px;color:#111;vertical-align:top;">${escapeHtml(value)}</td>
    </tr>
  `
}

function wrapper(title: string, bodyHtml: string) {
  return `
  <div style="font-family:-apple-system,Helvetica,Arial,sans-serif;max-width:560px;margin:0 auto;padding:32px 24px;">
    <div style="font-weight:800;font-size:14px;letter-spacing:0.08em;text-transform:uppercase;color:${BRAND_GREEN};margin-bottom:24px;">
      Kocreators
    </div>
    <h1 style="font-size:20px;margin:0 0 16px;color:#111;">${title}</h1>
    ${bodyHtml}
    <p style="margin-top:32px;font-size:12px;color:#999;">Kocreators · help@kocreators.com</p>
  </div>
  `
}

export function internalNotificationEmail(data: SubmissionData) {
  const heading =
    data.formType === 'quote'
      ? 'New project request'
      : data.formType === 'storeSignup'
        ? 'New store signup'
        : 'New contact form message'
  const rows = [
    row('Name', data.name),
    row('Email', data.email),
    row('Phone', data.phone),
    row('Organization', data.organization),
    row('Business Name', data.businessName),
    row('Plan', data.storePlatform ? STORE_PLATFORM_LABELS[data.storePlatform] || data.storePlatform : undefined),
    row('Product(s)', data.productInterest),
    row('Color', data.productColor),
    row('Quantity', data.quantity),
    row('In-hands date', data.inHandsDate),
  ].join('')

  const body = `
    <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">${rows}</table>
    ${
      data.message
        ? `<p style="margin:0 0 6px;font-size:13px;color:#666;">Additional details</p><div style="border-left:3px solid ${BRAND_GREEN};padding-left:12px;font-size:14px;color:#333;white-space:pre-wrap;">${escapeHtml(data.message)}</div>`
        : ''
    }
  `
  return wrapper(heading, body)
}

export function customerConfirmationEmail(data: SubmissionData) {
  const first = data.firstName || data.name?.split(' ')[0] || 'there'
  const rows = [
    row('Business Name', data.businessName),
    row('Plan', data.storePlatform ? STORE_PLATFORM_LABELS[data.storePlatform] || data.storePlatform : undefined),
    row('Product(s)', data.productInterest),
    row('Color', data.productColor),
    row('Quantity', data.quantity),
    row('In-hands date', data.inHandsDate),
  ].join('')

  const intro =
    data.formType === 'quote'
      ? ' about your project'
      : data.formType === 'storeSignup'
        ? ' about setting up your company store'
        : ''

  const body = `
    <p style="font-size:14px;color:#333;line-height:1.6;">
      Hi ${escapeHtml(first)},<br /><br />
      Thanks for reaching out to Kocreators${intro}. We've received your request and a member of our team will follow up within one business day.
    </p>
    ${rows ? `<p style="font-size:14px;color:#333;line-height:1.6;">Here's a copy of what you sent us:</p><table style="width:100%;border-collapse:collapse;margin-bottom:20px;">${rows}</table>` : ''}
    ${
      data.message
        ? `<p style="margin:0 0 6px;font-size:13px;color:#666;">Additional details</p><div style="border-left:3px solid ${BRAND_GREEN};padding-left:12px;font-size:14px;color:#333;white-space:pre-wrap;">${escapeHtml(data.message)}</div>`
        : ''
    }
  `
  return wrapper("We've got your request", body)
}
