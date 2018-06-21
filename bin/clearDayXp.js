#!/app/bin/env node

require( '../models/db' );

var mongoose = require( 'mongoose' );
let Uporabnik = mongoose.model("Uporabnik");
let moment = require('moment');
let SMSAPI = require('smsapicom'),smsapi = new SMSAPI({
    oauth: {
        accessToken: process.env.SMSAPI_token
    }
});
let nodemailer = require('nodemailer');
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.mailUser,
        pass: process.env.mailPass
    }
});


console.log("Deleting daily xp");
deleteXP();
console.log("Daily xp deleted");

console.log("Sending daily SMS");
sendSMS();
console.log("Daily SMS sent");

console.log("Sending daily emails");
sendMail();
console.log("Daily emails sent");

//DELETE DAILY XP
function deleteXP() {
    Uporabnik.where().updateMany({ $set: { "dayXp": 0 } }, function (err, res) {
        if (err) {
            console.log(err);
        } else { console.log(res); }
    });
}


// SEND DAILY SMS
function sendSMS() {
    Uporabnik.find({ notf_telefon: true }, function (err, smsusers) {
        if (err) {
            console.log(error);
            return;
        }
        for(let j = 0; j < smsusers.length; j++) {
            Naloge.find({ vezani_uporabniki: smsusers[j]._id }, function (err, naloga) {
                if (err) {
                    console.log(err);
                    return;
                }
                let temp = [];
                if (naloga.length == 0) {
                } else {
                    for (let i = 0; i < naloga.length; i++) {
                        let zac = moment(naloga[i].zacetek).format('MM-DD-YYYY');
                        let kon = moment(naloga[i].konec).format('MM-DD-YYYY');
                        let now = moment(Date.now()).format('MM-DD-YYYY');
                        if (dateCheck(zac,kon,now) && naloga[i].status == false) { // Če naloga neopravljena jo dodaj med opomnike
                            temp.push({
                                ime: naloga[i].ime,
                                opis: naloga[i].opis,
                                zacetek: naloga[i].zacetek,
                                konec: naloga[i].konec,
                                xp: naloga[i].xp,
                            });
                        }
                    }
                    if (temp) {                           
                        let vsebina = 'Današnji opomniki:\n\n';
                        for (let m=0;m<temp.length;m++) {
                            vsebina += "Ime: "+temp[m].ime+"\nOpis: "+temp[m].opis+"\nZačetek: "+moment(temp[m].zacetek).format("D. M ob H:m")+
                            "\nKonec: "+moment(temp[m].konec).format("D. M ob H:m")+"\nTočk: "+temp[m].xp+"\n\n";
                        }
                        sendMessage(smsusers[j].telefon, vsebina);
                    }
                }
            });
        }
    });
}

//EMAIL
function sendMail() {
    Uporabnik.find({ notf_email: true }, function (err, emailusers) {
        if (err) {
            console.log(error);
            return;
        }
        for(let j = 0; j < emailusers.length; j++) {
            Naloge.find({ vezani_uporabniki: emailusers[j]._id }, function (err, naloga) {
                if (err) {
                    throw err;
                    return;
                }
                let temp = [];
                if (naloga.length == 0) {
                } else {
                    for (let i = 0; i < naloga.length; i++) {
                        let zac = moment(naloga[i].zacetek).format('MM-DD-YYYY');
                        let kon = moment(naloga[i].konec).format('MM-DD-YYYY');
                        let now = moment(Date.now()).format('MM-DD-YYYY');
                        if (dateCheck(zac,kon,now) && naloga[i].status == false) { // Če naloga neopravljena jo dodaj med opomnike
                            temp.push({
                                ime: naloga[i].ime,
                                opis: naloga[i].opis,
                                zacetek: naloga[i].zacetek,
                                konec: naloga[i].konec,
                                xp: naloga[i].xp,
                            });
                        }
                    }
                    if (temp ) {                              
                        let vsebina = 'Današnji opomniki:\n\n';
                        for (let m=0; m<temp.length; m++) {
                            vsebina += "Ime: "+temp[m].ime+"\nOpis: "+temp[m].opis+"\nZačetek: "+moment(temp[m].zacetek).format("D. M ob H:m")+
                            "\nKonec: "+moment(temp[m].konec).format("D. M ob H:m")+"\nTočk: "+temp[m].xp+"\n\n";
                        }
                        mailOptions = {
                            from: '"MyFamily mailer"'+process.env.mailUser,
                            to: '"Usr"'+emailusers[j].email,
                            subject: "Opomnik " + moment(new Date()).format('M. D'),
                            text: vsebina,
                        }
                        console.log("Sending mail");
                        transporter.sendMail(mailOptions, function (error, info) {
                            if (error) {
                                console.log(error);
                            } else {
                                console.log('Email sent: ' + info.response);
                            }
                        });
                    }
                }
            });
        }
    });
}



function sendMessage(number, text){
    return smsapi.message
        .sms()
        .from('MyFamilyApp')
        .to(number)
        .message(text)
        .execute(); // return Promise
}

function displayResult(result){
    console.log(result);
}

function displayError(err){
    console.error(err);
}

function dateCheck(from, to, check) {
    let fDate, lDate, cDate;
    fDate = Date.parse(from);
    lDate = Date.parse(to);
    cDate = Date.parse(check);
    if ((cDate <= lDate && cDate >= fDate)) {
        return true;
    }
    return false;
}