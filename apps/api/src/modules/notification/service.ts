import nodemailer from 'nodemailer';
import { MailOptions } from 'nodemailer/lib/json-transport';

export const sendEmailNotification = async (text: string) => {
  const transporter = nodemailer.createTransport({
    host: process.env.MAILTRAP_HOST,
    port: 2525,
    auth: {
      user: process.env.MAILTRAP_USER,
      pass: process.env.MAILTRAP_PASS,
    },
  });

  const mailOptions: MailOptions = {
    from: process.env.MAILTRAP_SENDER,
    to: process.env.MAILTRAP_RECEIVER,
    subject: 'Notification - Currency',
    text,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email\n', error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};
