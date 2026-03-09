import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_EMAIL,
        pass: process.env.GMAIL_APP_PASSWORD,
    },
});

export const sendResetPasswordEmail = async (email, resetToken) => {
    try {
        // Encode token để an toàn trong URL
        const encodedToken = encodeURIComponent(resetToken);
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${encodedToken}`;
        
        const mailOptions = {
            from: process.env.GMAIL_EMAIL,
            to: email,
            subject: 'Reset Password - Fashion Store',
            html: `
                <h2>Yêu cầu đặt lại mật khẩu</h2>
                <p>Bạn nhận được email này vì yêu cầu đặt lại mật khẩu cho tài khoản của bạn.</p>
                <p>Vui lòng nhấp vào liên kết bên dưới để đặt lại mật khẩu của bạn:</p>
                <a href="${resetUrl}" style="background-color: #f97316; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; display: inline-block;">
                    Đặt lại mật khẩu
                </a>
                <p>Liên kết này sẽ hết hạn sau 1 giờ.</p>
                <p>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p>
            `,
        };

        await transporter.sendMail(mailOptions);
        console.log(`Reset password email sent to ${email}`);
        return true;
    } catch (error) {
        console.error('Error sending reset password email:', error);
        return false;
    }
};

export default transporter;
