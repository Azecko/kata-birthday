const nodemailer = require("nodemailer");
require('dotenv').config();

let transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.PORT,
    secure: true,
    auth: {
      user: process.env.AUTH_USER,
      pass: process.env.AUTH_PASSWORD,
    },
  });

async function sendMail(receiver, subject, html) {
    return transporter.sendMail({
        from: '"kata-birthday" <test-sami@epfl.ch>', // sender address
        to: receiver, // list of receivers
        subject: subject, // Subject line
        html: html, // html body
      });
}

async function getAge(date) {
    var birthdate = new Date(date);
    var cur = new Date();
    var diff = cur-birthdate;
    var age = Math.floor(diff/31557600000);
    return age; // Warning : depending on time of the day, age can be wrong????
}


let date = new Date()

let ISODate = date.toISOString().split('T')[0]
let d = ISODate.split('-')[2]
let m = ISODate.split('-')[1]
let y = ISODate.split('-')[0]

let birthdays = require('./birthdays.json')

let peopleToCelebrate = Object.entries(birthdays).filter((v, k) => {
    return v[1].birthdate.includes(`-${m}-${d}`)
})

const arrayRemove = (arr, value) => { 
    return arr.filter(function(ele) { 
        return ele != value
    })
}

const sendCelebrationEmailTo = async (emailList, peopleToCelebrate) => {
    var mailMessage = `Hello there ! Today is <strong>${peopleToCelebrate.firstname}</strong>'s birthday ! Don't forget to wish an happy birthday to him/her !<br>He/She is now <strong>${await getAge(peopleToCelebrate.birthdate)}</strong> years old.`
    console.log(`it's ${peopleToCelebrate.firstname} birthday sent to ${emailList}`)
    sendMail(emailList, `${peopleToCelebrate.firstname}'s birthday`, mailMessage)
}

peopleToCelebrate.forEach((e, i) => {
    let emailList = Object.keys(birthdays)
    emailList = arrayRemove(emailList, e[0])
    sendCelebrationEmailTo(emailList, e[1])
})