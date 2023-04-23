import nodemailer from "nodemailer";
import { ValidationError } from "./errors";
import { smtpConfig } from "../config/smtp";


export const sendMail = (mail:string,subject:string, text:string, html:string) =>{


  const transporter = nodemailer.createTransport(smtpConfig);
  const data = {
    from: '"No Reply" <headhunter@testHeadHunter.oi>',
    to: mail,
    subject: subject,
    text: text,
    html: html,
  };

  transporter.sendMail(data).then((result)=>{
    console.log('Wiadomość została wysłana');
    return result;
  }).catch((err)=>{
    console.log(err);
    throw new ValidationError('Mail nie został wysłany');
  })


  process.on('uncaughtException', (err) => {
     console.log('Nieobsłużony wyjątek: ', err);
   });


}


