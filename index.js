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
        html: html, // html body
        //text: html, // html body
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

let version = require('./package.json')
const getVersion = () => {
    return version["version"]
}

const sendCelebrationEmailTo = async (emailList, peopleToCelebrate, celebratedEmail) => {
    var mailMessage = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            body {
                font-family: 'Arial', sans-serif;
                background-color: #f0f0f0;
                color: #333;
                margin: 20px;
            }
            strong {
                color: #007480;
                font-weight: 900;
            }
            blockquote {
                margin: 15px 0;
                padding: 10px;
                background-color: #f9f9f9;
                border-left: 3px solid #007480;
            }
            cite {
                display: block;
                margin-top: 10px;
                color: #888;
            }
            a {
                text-decoration: none;
            }
            a:hover {
                text-decoration: underline;
            }
            footer {
                margin-top: 20px;
                font-size: 14px;
                color: #777;
            }
        </style>
    </head>
    <body>
        <h3>Hello there! 👋</h3>
        <p>Today is <strong>${peopleToCelebrate.firstname}</strong>'s birthday! Don't forget to wish a happy birthday to ${genderify(peopleToCelebrate.gender, 'him')} (<a href="mailto:${celebratedEmail}">${celebratedEmail}</a>) !<br>${genderify(peopleToCelebrate.gender, 'He')} is now ${await getAge(peopleToCelebrate.birthdate)} years old. 🎂</p>
        <p>Birthminder has selected this quote for ${peopleToCelebrate.firstname}:</p>
        <blockquote>
            <p>${getQuotes().quote}</p>
            <cite> — ${getQuotes().author}</cite>
        </blockquote>
        <p>Your truly,<br>Birthminder bot ❤</p>
        <br>
        <br>
        <hr>
    </body>
    </html>
    `;
    console.log(`${peopleToCelebrate.firstname}'s birthday sent to ${emailList}`);
    sendMail("ehouarn.duriaux@epfl.ch", `🎂 It's ${peopleToCelebrate.firstname}'s birthday`, mailMessage)
}

peopleToCelebrate.forEach((e, i) => {
    let emailList = Object.keys(birthdays)
    emailList = arrayRemove(emailList, e[0])
    sendCelebrationEmailTo(emailList, e[1], e[0])
})
