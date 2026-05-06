import nodemailer from "nodemailer";
import { NextRequest } from "next/server";

// ─── Types ───────────────────────────────────────────────────────────────────
interface ContactPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function buildEmailHtml(data: ContactPayload): string {
  return `
    <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;background:#0d0d14;color:#e2e8f0;border-radius:12px;overflow:hidden;">
      <div style="background:linear-gradient(135deg,#7c5cfc,#22d3ee);padding:24px 32px;">
        <h1 style="margin:0;font-size:22px;color:#fff;">⚡ New Contact Form Submission</h1>
        <p style="margin:6px 0 0;color:rgba(255,255,255,0.8);font-size:14px;">prayag.dev portfolio</p>
      </div>
      <div style="padding:32px;">
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="padding:10px 0;border-bottom:1px solid #1e1e2e;color:#94a3b8;font-size:13px;width:100px;">From</td>
              <td style="padding:10px 0;border-bottom:1px solid #1e1e2e;font-weight:600;">${data.name}</td></tr>
          <tr><td style="padding:10px 0;border-bottom:1px solid #1e1e2e;color:#94a3b8;font-size:13px;">Email</td>
              <td style="padding:10px 0;border-bottom:1px solid #1e1e2e;"><a href="mailto:${data.email}" style="color:#a78bfa;text-decoration:none;">${data.email}</a></td></tr>
          <tr><td style="padding:10px 0;border-bottom:1px solid #1e1e2e;color:#94a3b8;font-size:13px;">Subject</td>
              <td style="padding:10px 0;border-bottom:1px solid #1e1e2e;">${data.subject}</td></tr>
        </table>
        <div style="margin-top:24px;">
          <p style="color:#94a3b8;font-size:13px;margin-bottom:8px;">MESSAGE</p>
          <div style="background:#1a1a2e;border-radius:8px;padding:20px;border-left:3px solid #7c5cfc;line-height:1.7;white-space:pre-wrap;">${data.message}</div>
        </div>
        <div style="margin-top:24px;text-align:center;">
          <a href="mailto:${data.email}" style="display:inline-block;padding:12px 28px;background:linear-gradient(135deg,#7c5cfc,#22d3ee);color:#fff;text-decoration:none;border-radius:8px;font-weight:600;font-size:14px;">Reply to ${data.name}</a>
        </div>
      </div>
      <div style="padding:16px 32px;border-top:1px solid #1e1e2e;text-align:center;color:#4a4a6a;font-size:12px;">
        Sent via prayag.dev contact form
      </div>
    </div>
  `;
}

function buildSlackBlocks(data: ContactPayload) {
  return {
    text: `New message from ${data.name} via prayag.dev`,
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: "⚡ New Contact Form Submission",
          emoji: true,
        },
      },
      {
        type: "section",
        fields: [
          { type: "mrkdwn", text: `*Name:*\n${data.name}` },
          {
            type: "mrkdwn",
            text: `*Email:*\n<mailto:${data.email}|${data.email}>`,
          },
        ],
      },
      {
        type: "section",
        fields: [
          { type: "mrkdwn", text: `*Subject:*\n${data.subject}` },
          { type: "mrkdwn", text: `*Source:*\nprayag.dev portfolio` },
        ],
      },
      { type: "divider" },
      {
        type: "section",
        text: { type: "mrkdwn", text: `*Message:*\n${data.message}` },
      },
      {
        type: "actions",
        elements: [
          {
            type: "button",
            text: { type: "plain_text", text: "Reply", emoji: true },
            url: `mailto:${data.email}`,
            style: "primary",
          },
        ],
      },
    ],
  };
}

// ─── Route handler ────────────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as ContactPayload;

    // ── Basic server-side validation ─────────────────────────────────────────
    if (
      !body.name?.trim() ||
      !body.email?.trim() ||
      !body.subject?.trim() ||
      !body.message?.trim()
    ) {
      return Response.json(
        { error: "All fields are required." },
        { status: 400 },
      );
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
      return Response.json(
        { error: "Invalid email address." },
        { status: 400 },
      );
    }

    const errors: string[] = [];

    // ── Send email via Gmail SMTP ─────────────────────────────────────────────
    const gmailUser = process.env.GMAIL_USER;
    const gmailPass = process.env.GMAIL_APP_PASSWORD;

    if (gmailUser && gmailPass) {
      try {
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: { user: gmailUser, pass: gmailPass },
        });

        await transporter.sendMail({
          from: `"prayag.dev Contact" <${gmailUser}>`,
          to: gmailUser, // send to yourself
          replyTo: body.email, // reply goes to the sender
          subject: `[prayag.dev] ${body.subject}`,
          html: buildEmailHtml(body),
        });
      } catch (err) {
        console.error("[contact] email error:", err);
        errors.push("email");
      }
    } else {
      console.warn(
        "[contact] GMAIL_USER / GMAIL_APP_PASSWORD not set — skipping email",
      );
    }

    // ── Send Slack notification ───────────────────────────────────────────────
    const slackWebhook = process.env.SLACK_WEBHOOK_URL;

    if (slackWebhook) {
      try {
        const res = await fetch(slackWebhook, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(buildSlackBlocks(body)),
        });
        if (!res.ok) throw new Error(`Slack responded ${res.status}`);
      } catch (err) {
        console.error("[contact] slack error:", err);
        errors.push("slack");
      }
    } else {
      console.warn(
        "[contact] SLACK_WEBHOOK_URL not set — skipping Slack notification",
      );
    }

    // Return success even if one channel failed (partial delivery is still useful)
    return Response.json({ ok: true, partialErrors: errors });
  } catch (err) {
    console.error("[contact] unexpected error:", err);
    return Response.json({ error: "Internal server error." }, { status: 500 });
  }
}
