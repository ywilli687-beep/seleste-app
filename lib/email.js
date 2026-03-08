import { Resend } from 'resend';

// Use environment variable for the real API key, fallback for dev/mocking
const resend = new Resend(process.env.RESEND_API_KEY || 're_mock12345');

export async function sendWelcomeEmail(email, name, businessName) {
    if (!process.env.RESEND_API_KEY) {
        console.log(`[MOCK EMAIL] Sent welcome email to ${email}`);
        return { success: true, mock: true };
    }

    try {
        const data = await resend.emails.send({
            from: 'Seleste <hello@seleste.com>', // Replace with your verified domain
            to: [email],
            subject: 'Your Digital Preparedness Audit is Ready',
            html: `
                <div style="font-family: sans-serif; padding: 20px;">
                    <h2>Welcome to Seleste, ${name || 'there'}!</h2>
                    <p>We have successfully scanned ${businessName} and your Digital Preparedness Audit is ready to view.</p>
                    <br/>
                    <a href="https://seleste.com/login" style="background-color: #111; color: #fff; padding: 12px 24px; text-decoration: none; font-weight: bold;">View Your Report</a>
                </div>
            `
        });
        return { success: true, data };
    } catch (error) {
        console.error('Email failed to send:', error);
        return { success: false, error };
    }
}
