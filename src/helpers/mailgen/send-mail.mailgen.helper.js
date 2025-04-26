import Mailgen from "mailgen";
import nodemailer from "nodemailer";
import fs from "fs/promises";
import path from "path";

/**
 *
 * @param {{email: string; subject: string; mailgenContent: Mailgen.Content; }} options
 * @param {string[]} attachments
 */
const sendEmail = async (options, attachments = []) => {
  // Initialize mailgen instance with default theme and brand configuration
  const mailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: "SmartWork",
      link: "https://smartworkonline.com",
    },
  });

  // Generate the plaintext version of the e-mail (for clients that do not support HTML)
  const emailTextual = mailGenerator.generatePlaintext(options.mailgenContent);

  // Generate an HTML email with the provided contents
  const emailHtml = mailGenerator.generate(options.mailgenContent);

  const formattedAttachments = await Promise.all(
    attachments.map(async (attachment) => {
      const file = await fs.readFile(attachment);
      return {
        filename: path.basename(attachment),
        content: file,
      };
    }),
  );

  // Create a nodemailer transporter instance which is responsible to send a mail
  const transporter = nodemailer.createTransport({
    service: "gmail",
    secure: true,
    auth: {
      user: process.env.NODEMAILER_USER,
      pass: process.env.NODEMAILER_PASS,
    },
  });

  try {
    const to = Array.isArray(options.email)
      ? options.email.splice(-1)
      : options.email;

    const cc = options.email;

    const mail = {
      from: `SmartWork <${process.env.NODEMAILER_USER}>`,
      ...(Array.isArray(options.email) ? { to, cc } : { to }),
      // to: Array.isArray(options.email)
      //   ? options.email.join(", ")
      //   : options.email, // receiver's mail
      subject: options.subject, // mail subject
      text: emailTextual, // mailgen content textual variant
      html: emailHtml, // mailgen content html variant
      ...(formattedAttachments.length
        ? { attachments: formattedAttachments }
        : {}),
    };
    await transporter.sendMail(mail);
    // if (Array.isArray(options.email)) {
    //   options.email.forEach(async (email) => {
    //     const mail = {
    //       from: `SmartWork <${process.env.NODEMAILER_USER}>`,
    //       to: email, // receiver's mail
    //       subject: options.subject, // mail subject
    //       text: emailTextual, // mailgen content textual variant
    //       html: emailHtml, // mailgen content html variant
    //       ...(formattedAttachments.length
    //         ? { attachments: formattedAttachments }
    //         : {}),
    //     };
    //     await transporter.sendMail(mail);
    //   });
    // } else {
    //   const mail = {
    //     from: `SmartWork <${process.env.NODEMAILER_USER}>`,
    //     to: options.email, // receiver's mail
    //     subject: options.subject, // mail subject
    //     text: emailTextual, // mailgen content textual variant
    //     html: emailHtml, // mailgen content html variant
    //     ...(formattedAttachments.length
    //       ? { attachments: formattedAttachments }
    //       : {}),
    //   };
    //   await transporter.sendMail(mail);
    // }
  } catch (error) {
    // As sending email is not strongly coupled to the business logic it is not worth to raise an error when email sending fails
    // So it's better to fail silently rather than breaking the app
    console.log(
      "Email service failed silently. Make sure you have provided your MAILTRAP credentials in the .env file",
    );
    console.log("Error: ", error);
  }
};

export default sendEmail;
