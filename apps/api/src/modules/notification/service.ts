import nodemailer from 'nodemailer';

export const sendEmailNotification = async (text: string) => {
  // TODO: Test
  const transporter = nodemailer.createTransport({
    host: 'sandbox.smtp.mailtrap.io',
    port: 2525,
    auth: {
      user: '1f3d784cf642bf',
      pass: '********8fa6',
    },
  });

  const mailOptions = {
    subject: 'Test',
    text,
  };

  await transporter.sendMail(mailOptions);
};
