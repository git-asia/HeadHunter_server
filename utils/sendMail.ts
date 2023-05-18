import nodemailer from "nodemailer";
import { ValidationError } from "./errors";
import { smtpConfig } from "../config/smtp";


export const sendMail = (mail:string,subject:string, text:string, html:string='') =>{


  const transporter = nodemailer.createTransport(smtpConfig);
  const data = {
    from: '"No Reply" <headhunter@testHeadHunter.oi>',
    to: mail,
    subject: subject,
    text: text,
    html: html,
  };

  return transporter.sendMail(data)
    .then((result)=>{
    console.log('Wiadomość została wysłana');
    return result;
   })
    .catch((err)=>{
    console.log(err);
    throw new ValidationError('E-mail nie został wysłany');
  })


}
