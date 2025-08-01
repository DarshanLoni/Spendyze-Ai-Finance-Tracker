import nodemailer from 'nodemailer';

// Helper function to safely read and clean environment variables.
const cleanEnvVar = (variable) => {
    if (typeof variable !== 'string') {
        return variable;
    }
    // This removes leading/trailing whitespace and surrounding quotes
    return variable.trim().replace(/^['"]|['"]$/g, '');
};

// --- SMTP Configuration and Transporter Initialization ---
let transporter;

const smtpHost = cleanEnvVar(process.env.SMTP_HOST);
const smtpPort = cleanEnvVar(process.env.SMTP_PORT);
const smtpUser = cleanEnvVar(process.env.SMTP_USER);
const smtpPass = cleanEnvVar(process.env.SMTP_PASS);
const fromName = cleanEnvVar(process.env.FROM_NAME) || 'Spendyze';
const fromEmail = cleanEnvVar(process.env.FROM_EMAIL);

// Check if essential SMTP configuration is missing.
if (!smtpHost || !smtpPort || !smtpUser || !smtpPass || !fromEmail) {
    console.error("**************************************************************************************");
    console.error("WARNING: SMTP environment variables are not fully configured in your .env file.");
    console.error("Email service is running in 'development mode' and will NOT send real emails.");
    console.error("Emails will be logged to the console instead.");
    console.error("Please set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, and FROM_EMAIL to enable sending.");
    console.error("**************************************************************************************");

    // Create a mock transporter that logs emails to the console.
    transporter = {
        sendMail: (mailOptions) => {
            console.log("\n--- DEV EMAIL (Not Sent) ---");
            console.log(`To: ${mailOptions.to}`);
            console.log(`From: ${mailOptions.from}`);
            console.log(`Subject: ${mailOptions.subject}`);
            console.log("--- Body (HTML) ---");
            console.log(mailOptions.html);
            console.log("----------------------------\n");
            // Return a promise that mimics a successful send from Nodemailer
            return Promise.resolve({
                messageId: `dev-mode-${Date.now()}`
            });
        }
    };
} else {
    // --- Create a real transporter object using the configured SMTP transport ---
    transporter = nodemailer.createTransport({
        host: smtpHost,
        port: parseInt(smtpPort, 10),
        secure: parseInt(smtpPort, 10) === 465, // true for 465, false for other ports
        auth: {
            user: smtpUser,
            pass: smtpPass,
        },
    });
}

const formatCurrency = (value) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(value);

/**
 * Sends a professionally formatted HTML budget alert email.
 */
export const sendBudgetAlertEmail = async (
    user,
    transactions,
    totalIncome,
    totalExpenses,
    threshold,
    aiSummary
) => {
    const usagePercentage = ((totalExpenses / totalIncome) * 100).toFixed(0);
    const subject = `Spendyze Budget Alert: You've used ${usagePercentage}% of your income`;

    const htmlBody = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 0; background-color: #f8fafc; }
            .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; }
            .header { background-color: #10b981; color: #ffffff; padding: 24px; text-align: center; }
            .header h1 { margin: 0; font-size: 24px; }
            .content { padding: 32px; color: #334155; line-height: 1.6; }
            .content h2 { color: #1e293b; }
            .summary-box { background-color: #f1f5f9; border-left: 4px solid #10b981; padding: 16px; margin: 24px 0; border-radius: 4px; }
            .footer { text-align: center; padding: 24px; font-size: 12px; color: #64748b; }
            .button { display: inline-block; background-color: #10b981; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Budget Alert</h1>
            </div>
            <div class="content">
                <h2>Hi ${user.name},</h2>
                <p>This is a friendly alert about your monthly budget. You've reached the <strong>${threshold}%</strong> spending threshold.</p>
                <p>
                    You have spent <strong>${formatCurrency(totalExpenses)}</strong> of your <strong>${formatCurrency(totalIncome)}</strong> income, which is <strong>${usagePercentage}%</strong> of your budget.
                </p>
                <div class="summary-box">
                    <strong>AI Financial Insight:</strong>
                    <p style="margin-top: 8px; font-style: italic;">"${aiSummary}"</p>
                </div>
                <p>Log in to Spendyze to see a full breakdown of your transactions and stay on top of your finances.</p>
                <p style="text-align: center; margin-top: 32px;">
                    <a href="https://spendyze-self.vercel.app/#/app/dashboard" class="button">View Your Dashboard</a>
                </p>
            </div>
            <div class="footer">
                <p>&copy; ${new Date().getFullYear()} Spendyze. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    `;

    const mailOptions = {
        from: `"${fromName}" <${fromEmail}>`,
        to: user.email,
        subject: subject,
        html: htmlBody,
    };

    try {
        let info = await transporter.sendMail(mailOptions);
        // Only log to console if we are NOT in dev mode (i.e., real transporter was used)
        if (smtpHost) {
             console.log(`Email sent successfully to ${user.email}. Message ID: ${info.messageId}`);
        }
        return { success: true };
    } catch (error) {
        console.error(`Error sending email to ${user.email}:`, error);
        return { success: false, error: "Failed to send alert email." };
    }
};