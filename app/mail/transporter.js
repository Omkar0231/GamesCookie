const nodemailer = require("nodemailer");

// IMPORTANT: Move these to environment variables (.env file)
// Never commit credentials to version control!

exports.transporter = () => {
    try {
        return nodemailer.createTransport({
            host: process.env.SMTP_HOST || "live.smtp.mailtrap.io",
            port: parseInt(process.env.SMTP_PORT) || 587,
            secure: false, // true for 465, false for other ports (587)
            auth: {
                user: process.env.SMTP_USER || "api",
                pass: process.env.SMTP_PASS || "7bc702b0771da1d666cd419550362ddd",
            },
            // Optional: Add these for better reliability
            pool: true, // Use pooled connections
            maxConnections: 5,
            maxMessages: 100,
        });
    } catch (error) {
        console.error("❌ Error creating email transporter:", error);
        throw error;
    }
};

// Test transporter connection
exports.verifyTransporter = async () => {
    try {
        const transporter = this.transporter();
        await transporter.verify();
        console.log("✅ Email transporter is ready");
        return true;
    } catch (error) {
        console.error("❌ Email transporter verification failed:", error);
        return false;
    }
};