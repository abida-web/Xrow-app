import { Resend } from "resend";

// Initialize Resend with your API key
const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail({
  to,
  subject,
  html,
  text,
}: {
  to: string;
  subject: string;
  html: string;
  text: string;
}) {
  try {
    const { data, error } = await resend.emails.send({
      from: "onboarding@resend.dev", // FREE testing domain from Resend
      to: to,
      subject: subject,
      html: html,
      text: text,
    });

    if (error) {
      console.error("Email error:", error);
      return;
    }

    console.log("✅ Email sent successfully:", data);
  } catch (error) {
    console.error("Failed to send email:", error);
  }
}
