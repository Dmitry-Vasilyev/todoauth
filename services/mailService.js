const nodemailer = require("nodemailer");

class MailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port:process.env.SMTP_PORT,
            secure: true,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });
    }

    async sendActivationMail(to, link) {
        await this.transporter.sendMail({
            from: process.env.SMTP_USER,
            to: to,
            subject: "Активация аккаунта на: " + process.env.API_URL,
            text: '',
            html:`
                    <div>
                        <a href="${link}">${link}</a>
                    </div>
            `
        })
    }
}

module.exports = new MailService();