const nodemailer = require("nodemailer");
require('dotenv').config();

let transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.PORT,
    secure: false,
    auth: {
      user: process.env.AUTH_USER,
      pass: process.env.AUTH_PASSWORD,
    },
  });

async function sendMail(receiver, subject, html) {
    return transporter.sendMail({
        from: process.env.MAIL_FROM, // sender address
        to: receiver, // list of receivers
        subject: subject, // Subject line
        //html: html, // html body
        text: html, // html body
      });
}

async function getAge(date) {
    var birthdateYear = new Date(date).toLocaleDateString("nl").split("-")[2];
    var curYear = new Date().toLocaleDateString("nl").split("-")[2];
    var age = curYear-birthdateYear;
    return age;
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

const genderify = (gender, word) => {
    if (gender !== "f") return word
    let words = {
        "him": "her",
        "He": "She"
    }
    return words[word]
}

let quotes = require('./quotes.json')
const getQuotes = () => {
    return quotes[ quotes.length * Math.random() << 0]
}

const sendCelebrationEmailTo = async (emailList, peopleToCelebrate, celebratedEmail) => {
    var mailMessage
    mailMessage = `Hello there!\n\n`
    mailMessage += `Today is *${peopleToCelebrate.firstname}*'s birthday! Don't forget to wish an happy birthday to ${genderify(peopleToCelebrate.gender, 'him')} (${celebratedEmail})!\n${genderify(peopleToCelebrate.gender, 'He')} is now ${await getAge(peopleToCelebrate.birthdate)} years old.`
    mailMessage += `\n\nBirthminder has selected this quote for ${peopleToCelebrate.firstname}:\n`
    mailMessage += `« ${getQuotes().quote} »`
    const quoteAuthor = `— ${getQuotes().author}`
    mailMessage += `\n${quoteAuthor.padStart(72)}`
    mailMessage += `\n\nYour truly,\nBirthminder bot ❤`
    console.log(`${peopleToCelebrate.firstname} birthday sent to ${emailList}`)
    sendMail(emailList, `🎂 It's ${peopleToCelebrate.firstname}'s birthday`, mailMessage)
}

peopleToCelebrate.forEach((e, i) => {
    let emailList = Object.keys(birthdays)
    emailList = arrayRemove(emailList, e[0])
    sendCelebrationEmailTo(emailList, e[1], e[0])
})
