
const transporterServer = require("./transporter.js");



// Login OTP Email
exports.loginOtp = async (req, res, next) => {
    try {
        const { email, otp } = req; // Get from req.body, not req
        
        // Validate inputs
        if (!email || !otp) {
            return 'Email and OTP are required'
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return 'Invalid email format';
        }

        // Get transporter (fix: call the function)
        const transporter = transporterServer.transporter();

        // Get user name (you can fetch from database or use email)
        // const userName = email.split('@')[0]; // Simple fallback
        const userName = email

        // Send email
        const info = await transporter.sendMail({
            from: `"GamesCookie" <${process.env.SMTP_EMAIL}>`,
            to: email,
            // subject: "Your GamesCookie Verification Code 🔐",
            // subject: `Your OTP code is: ${otp}. This code expires in 10 minutes.`,
            subject: `GamesCookie Verification Code 🔐`,
            html: getEmailTemplate(userName, otp),
        });

        console.log("✅ OTP Email sent successfully:", info.messageId);

    } catch (error) {
        console.error("❌ Error sending OTP email:", error);
    }
};




// OTP Email Template
const getEmailTemplate = (userName, otp) => {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OTP Verification</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Arial, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; font-family: 'Segoe UI', Arial, sans-serif;">

        <tr>
            <td style="background: #ffffff; padding: 40px 30px;">
                <p style="color: #333; font-size: 16px; line-height: 1.6; margin: 0;">
                    Your OTP is <strong>${otp}</strong>. This code expires in 10 minutes.
                </p>

                <p style="color: #333; font-size: 16px; line-height: 1.6; margin: 20px 0 0 0;">
                    If you didn't request this code, please ignore this email or contact our support team immediately.
                </p>
                <p style="color: #333; font-size: 16px; line-height: 1.6; margin: 10px 0 0 0;">
                    Stay secure! 🛡️<br>
                    <strong>The GamesCookie Security Team</strong>
                </p>

                <p style="margin: 0 0 10px 0; font-size: 14px;">
                    Need help? Contact us at <a href="mailto:support@gamescookie.com" style="text-decoration: underline;">support@gamescookie.com</a>
                </p>
                <p style="margin: 15px 0 0 0; font-size: 12px; opacity: 0.8;">
                    © 2025 GamesCookie. All rights reserved.
                </p>

            </td>
        </tr>
    </table>
</body>
</html>
    `;
};