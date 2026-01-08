const transporterServer = require("./transporter.js");

// Welcome Email
exports.sendEmail = async (req, res, next) => {
    try {

        // const { name, number, website_url } = req; // Get from req.body, not req
        const transporter = transporterServer.transporter();

        //send to admin
        await transporter.sendMail({
            from: `"GamesCookie" <${process.env.SMTP_EMAIL}>`,
            to: process.env.EMAIL_TO,
            subject: "New Request from Add HTML5 Games",
            html: getEmailTemplate(req),
        });

        console.log("✅ HTML5 Games email sent");
        return { success: true };

    } catch (error) {
        console.error("❌ Error sending HTML5 Games email:", error);
        return { success: false, error: error.message };
    }
};




const getEmailTemplate = (req) => {
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
                <h2 style="color: #6E0B1B; margin: 0 0 20px 0; font-size: 28px;">Game Request Received! 🎯</h2>
                <p style="color: #333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                    Hey <strong>GamesCookie</strong>,
                </p>
                <div style="background: linear-gradient(135deg, rgba(110, 11, 27, 0.1) 0%, rgba(74, 8, 18, 0.1) 100%); border: 2px solid #f8e71c; padding: 25px; margin: 25px 0; border-radius: 15px;">
                    <h3 style="color: #6E0B1B; margin: 0 0 20px 0; font-size: 18px; text-align: center;">🎮 Your Game Request</h3>
                    <div style="background: white; border-radius: 10px; padding: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                        <table width="100%" cellpadding="10" cellspacing="0" style="font-size: 15px;">
                            <tr>
                                <td style="color: #666; padding: 10px 0; width: 35%;"><strong>Name:</strong></td>
                                <td style="color: #333; padding: 10px 0;">${req.name}</td>
                            </tr>
                            <tr>
                                <td style="color: #666; padding: 10px 0;"><strong>Mobile Number:</strong></td>
                                <td style="color: #333; padding: 10px 0;">${req.number}</td>
                            </tr>
                            <tr>
                                <td style="color: #666; padding: 10px 0;"><strong>Website URL:</strong></td>
                                <td style="color: #333; padding: 10px 0;">${req.website_url}</td>
                            </tr>
                        </table>
                    </div>
                </div>
            </td>
        </tr>
        <tr>
            <td style="background: #6E0B1B; padding: 30px; text-align: center; border-radius: 0 0 10px 10px;">
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