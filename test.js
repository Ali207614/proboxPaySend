// let { constructor } = require('./src/helpers')
// let moment = require("moment");
// const axios = require("axios");
// async function func() {
//     let n = await constructor({ Phone1: 998970014561, status: false, month: 'May', monthNum: 2, listPaymentLength: 3, CardName: "Muhammadali" })
//     let d = await sendMessageAxios([n])
//     console.log(d)
// }
// func()


// async function sendMessageAxios(data) {
//     try {
//         if (data.length) {
//             const res = await axios.post(
//                 "https://send.smsxabar.uz/broker-api/send",
//                 {
//                     messages: data.slice(0, 100),
//                 },
//                 {
//                     auth: {
//                         username: "zafartravel",
//                         password: "iEaG)d4J5&^8",
//                     },
//                 }
//             );
//             return { status: res.status, data };
//         }
//     } catch (err) {
//         console.log(err)
//     }
// }



for (let i = 0; i < 2; i++) {
    console.log(i)
}