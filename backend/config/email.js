import nodemailer from 'nodemailer';

class EmailConfig {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_EMAIL,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });
  }

  async sendResetPasswordEmail(email, resetToken) {
    try {
      // Encode token để an toàn trong URL
      const encodedToken = encodeURIComponent(resetToken);
      const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${encodedToken}`;

      const mailOptions = {
        from: process.env.GMAIL_EMAIL,
        to: email,
        subject: 'Reset Password - Fashion Store',
        text: `Đặt lại mật khẩu\n\nXin chào,\n\nBạn đã yêu cầu đặt lại mật khẩu. Vui lòng vào link sau để đặt lại mật khẩu của bạn:\n\n${resetUrl}\n\nLiên kết này chỉ có hiệu lực trong 1 giờ.\n\nNếu bạn không yêu cầu điều này, vui lòng bỏ qua email này.\n\nFashion Store`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
              <meta charset="UTF-8">
          </head>
          <body style="font-family: Arial, sans-serif; background-color: #f5f5f5; margin: 0; padding: 0;">
              <div style="max-width: 600px; margin: 20px auto; background-color: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                  <div style="background-color: #f97316; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
                      <h2 style="margin: 0; font-size: 28px;">Đặt lại mật khẩu</h2>
                  </div>
                  <div style="padding: 30px;">
                      <p style="color: #333; font-size: 16px;">Xin chào,</p>
                      <p style="color: #555; font-size: 16px; line-height: 1.6;">Bạn đã yêu cầu đặt lại mật khẩu cho tài khoản của bạn.</p>
                      <p style="color: #555; font-size: 16px; line-height: 1.6;">Vui lòng nhấp vào nút bên dưới để tiếp tục:</p>
                      <div style="text-align: center; margin: 30px 0;">
                          <a href="${resetUrl}" style="background-color: #f97316; color: white; padding: 14px 40px; text-decoration: none; border-radius: 4px; font-size: 16px; font-weight: bold; display: inline-block;">Đặt lại mật khẩu</a>
                      </div>
                      <p style="color: #666; font-size: 14px;">Hoặc copy đường dẫn này:</p>
                      <p style="background-color: #f0f0f0; padding: 12px; border-left: 4px solid #f97316; word-break: break-all;">
                          ${resetUrl}
                      </p>
                      <p style="color: #e74c3c;"><strong>⏱️ Link có hiệu lực 1 giờ</strong></p>
                  </div>
              </div>
          </body>
          </html>
        `,
      };

      await this.transporter.sendMail(mailOptions);
      return true;

    } catch (error) {
      console.error('Error sending reset password email:', error);
      return false;
    }
  }
}

export default new EmailConfig();