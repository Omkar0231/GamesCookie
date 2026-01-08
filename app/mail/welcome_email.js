const transporterServer = require("./transporter.js");

// Welcome Email
exports.sendWelcomeEmail = async (req, res, next) => {
    try {

        const { email } = req; // Get from req.body, not req
        
        // Validate inputs
        if (!email) {
            return 'Email is required'
        }

        const transporter = transporterServer.transporter();

        await transporter.sendMail({
            from: `"GamesCookie" <${process.env.SMTP_EMAIL}>`,
            to: email,
            subject: "Welcome to GamesCookie! 🎮",
            html: getEmailTemplate(email),
        });

        console.log("✅ Welcome email sent to:", email);
        return { success: true };

    } catch (error) {
        console.error("❌ Error sending welcome email:", error);
        return { success: false, error: error.message };
    }
};



// OTP Email Template
const getEmailTemplate = (email) => {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0;">
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; font-family: 'Segoe UI', Arial, sans-serif;">
        <tr>
            <td style="background: linear-gradient(135deg, #6E0B1B 0%, #4a0812 100%); padding: 40px 30px; text-align: center; border-radius: 10px 10px 0 0;">
                <h1 style="color: #f8e71c; margin: 0; font-size: 32px; font-weight: bold;">🎮 GamesCookie</h1>
                <p style="color: #f8e71c; margin: 10px 0 0 0; font-size: 14px;">Play Free Online Games</p>
            </td>
        </tr>
        <tr>
            <td style="background: #ffffff; padding: 40px 30px;">
                <h2 style="color: #6E0B1B; margin: 0 0 20px 0; font-size: 28px;">Welcome to GamesCookie! 🎉</h2>
                <p style="color: #333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                    Hi <strong>${email}</strong>,
                </p>
                <p style="color: #333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                    We're thrilled to have you join our gaming community! Get ready to explore thousands of exciting games.
                </p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="https://gamescookie.com" style="display: inline-block; background: #6E0B1B; color: #f8e71c; text-decoration: none; padding: 15px 40px; border-radius: 30px; font-size: 16px; font-weight: bold;">
                        Start Playing Now
                    </a>
                </div>


                <p style="color: #333; font-size: 16px; line-height: 1.6; margin: 20px 0 0 0;">
                    If you didn't create account, please ignore this email or contact our support team immediately.
                </p>
                <p style="color: #333; font-size: 16px; line-height: 1.6; margin: 10px 0 0 0;">
                    Stay secure! 🛡️<br>
                    <strong>The GamesCookie Security Team</strong>
                </p>

            </td>
        </tr>
        <tr>
            <td style="background: #6E0B1B; padding: 30px; text-align: center; border-radius: 0 0 10px 10px;">
                <p style="color: #f8e71c; margin: 0 0 10px 0; font-size: 14px;">
                    Need help? Contact us at <a href="mailto:support@gamescookie.com" style="color: #f8e71c; text-decoration: underline;">support@gamescookie.com</a>
                </p>
                <p style="color: #f8e71c; margin: 15px 0 0 0; font-size: 12px; opacity: 0.8;">
                    © 2025 GamesCookie. All rights reserved.
                </p>
            </td>
        </tr>
    </table>
</body>
</html>
    `;
};