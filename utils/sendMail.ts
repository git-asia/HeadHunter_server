import nodemailer from "nodemailer";
import { ValidationError } from "./errors";
import { SentMessageInfo } from "nodemailer/lib/smtp-transport";
import { smtpConfig } from "../config/smtp";

export const sendMail =async (mail:string,subject:string, text:string, html:string):Promise<SentMessageInfo> =>{


  const transporter = nodemailer.createTransport(smtpConfig);

  const send = await transporter.sendMail({
    from: '"Fred Foo 👻" <foo@example.com>',
    to: mail,
    subject: subject,
    text: text,
    html: html,
  });
  console.log(send);
  return send;

  // process.on('uncaughtException', (err) => {
  //   console.log('Nieobsłużony wyjątek: ', err);
  // });


}