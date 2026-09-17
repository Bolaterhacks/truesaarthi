import 'server-only';

import nodemailer from 'nodemailer';

const { SENDING_EMAIL_FROM, TO_EMAIL, APP_PASSWORD } = process.env;

// Gmail SMTP with an App Password (not the account password).
const transporter =
  SENDING_EMAIL_FROM && APP_PASSWORD
    ? nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: { user: SENDING_EMAIL_FROM, pass: APP_PASSWORD },
      })
    : null;

const escape = (value) =>
  String(value ?? '').replace(
    /[&<>"']/g,
    (c) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c],
  );

/**
 * Emails a form submission to TO_EMAIL. Reply-To is the visitor, so hitting
 * "Reply" in the inbox answers them directly.
 */
export async function sendSubmissionEmail({ kind, name, email, program, message }) {
  if (!transporter) {
    throw new Error('SMTP is not configured (SENDING_EMAIL_FROM / APP_PASSWORD).');
  }

  const rows = [
    ['Form', kind === 'guide' ? 'Free guide request' : 'Contact form'],
    ['Name', name],
    ['Email', email],
    ['Interested in', program],
    ['Message', message],
  ].filter(([, value]) => value);

  const subject =
    kind === 'guide'
      ? `New guide request — ${email}`
      : `New message from ${name || email}`;

  await transporter.sendMail({
    from: `"Website Form" <${SENDING_EMAIL_FROM}>`,
    to: TO_EMAIL || SENDING_EMAIL_FROM,
    replyTo: name ? `"${name.replace(/"/g, '')}" <${email}>` : email,
    subject,
    text: rows.map(([k, v]) => `${k}: ${v}`).join('\n\n'),
    html: `<table cellpadding="8" style="font-family:sans-serif;font-size:14px;border-collapse:collapse">${rows
      .map(
        ([k, v]) =>
          `<tr><td style="vertical-align:top;font-weight:600;white-space:nowrap">${k}</td><td style="white-space:pre-wrap">${escape(v)}</td></tr>`,
      )
      .join('')}</table>`,
  });
}
