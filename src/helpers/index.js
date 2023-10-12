let fs = require("fs");
let path = require("path");
const moment = require("moment");
const get = require('lodash')
function formatterCurrency(
    number = 0,
    currency = "UZS",
    locale = "ru",
    maximumSignificantDigits = 10
) {
    return number.toLocaleString(locale, {
        style: "currency",
        currency: currency,
        maximumSignificantDigits: maximumSignificantDigits,
    });
}

const lastCurrency = (currencyList) => {
    return currencyList.sort(
        (a, b) =>
            +moment(b.RateDate).format("YYYYMMDD") -
            +moment(a.RateDate).format("YYYYMMDD")
    )[0];
};

async function constructor({ insTotal = 0, paidTotal = 0, Phone1, status = false, month, monthNum, listPaymentLength, CardName }) {
    let n = ``
    let vznosObj = {
        6: 5,
        11: 10,
        16: 15
    }
    let obj = {
        recipient: Phone1,
        "message-id": "abc000000001",
        sms: {
            originator: "PROBOX",
            content: {
                text: +insTotal != +paidTotal ? `
                Assalomu alaykum, ${CardName}

                Sizning ProBox bilan bo'lgan samarali hamkorligingiz uchun sizga katta rahmat! Sizning ${vznosObj[listPaymentLength] || listPaymentLength} oylik to'lovingizni ${monthNum} oyligi qisman to'landi.
                Hurmat bilan,
                ProBox
                ` : status ? `Assalomu alaykum, ${CardName}

                Sizning ProBox bilan bo'lgan samarali hamkorligingiz uchun sizga katta rahmat! Sizning ${vznosObj[listPaymentLength] || listPaymentLength} oylik to'lovingizni ${monthNum} oyligi muvaffaqiyatli amalga oshirildi.  Siz ${month} oyining iPhone 14 yutuqli o’ynida ishtirokshisi bo’ldingiz, omad tilaymiz.
                
                Hurmat bilan,
                ProBox` : `Assalomu alaykum, ${CardName}

                Sizning ProBox bilan bo'lgan samarali hamkorligingiz uchun sizga katta rahmat! Sizning ${vznosObj[listPaymentLength] || listPaymentLength} oylik to'lovingizni ${monthNum} oyligi muvaffaqiyatli amalga oshirildi.  Hurmat bilan,
                ProBox`
            },
        },
    };
    return obj;
}
async function constructorStatus({ insTotal = 0, paidTotal = 0, Phone1, status = false, month, monthNum, listPaymentLength, CardName, index }) {
    let n = ``
    let vznosObj = {
        6: 5,
        11: 10,
        16: 15
    }
    let obj = {
        recipient: Phone1,
        "message-id": "abc000000001",
        sms: {
            originator: "PROBOX",
            content: {
                text:
                    index == 0 ?
                        `Assalomu alaykum, ${CardName}

                Sizning Apple mahsulotlaringizni muddatli to'lovga harid qilganingiz uchun sizga katta rahmat! Yangi Apple mahsulotingizdan zavq olishingizni umid qilamiz!
                
                Hurmat bilan,
                ProBox
                ` : `Assalomu Alaykum ${CardName}, ProBox kompaniyasing xizmat ko'rsatish sifatini oshirmoqchimiz,  yaxshilash uchun sizning fikringiz juda muhim, taklifingizni kutib qolamiz. 
                
                Hurmat bilan, ProBox 

                https://docs.google.com/forms/d/e/1FAIpQLSf98oP5M876BVenv_W15QbmeCm2PffHiLwFMb_Yk3w8Ep8PmQ/viewform`
            },
        },
    };
    return obj;
}



const payDate = (obj) => {
    let payDate = new Date(obj.DOCDUEDATE) //  tolagan sana
    let pay = new Date(obj.DUEDATE)
    let status = payDate.getFullYear() == pay.getFullYear() && payDate.getMonth() <= pay.getMonth()
    if (status) {
        status = payDate.getMonth() == pay.getMonth() ? payDate.getDate() <= pay.getDate() : true
    }
    return {
        status: (((obj.U_FirstPayment * 1) > 0) && obj.InstId == 1) ? 3 : (status && (obj.InsTotal == obj.PaidToDate)), month: monthObj[moment(obj.DUEDATE).format('M')]
    }
}

const schema = async (data, schemaText) => {
    return `${schemaText[0].sms.content.text}\n\n\nFullName: ${data.CardName}\nPhone: ${data.Phone1}\nFirstPayment: ${(data.U_FirstPayment * 1) > 0}\nTo'lagan summa va vaqt: ${data.PaidToDate} || ${moment(data.DOCDUEDATE).format('L')}\nTo'lashi kerak bo'lgan summa va vaqt: ${data.InsTotal} || ${moment(data.DUEDATE).format('L')}\nVznos: ${data.InstId}`
}


const readDoc = () => {
    let docs = fs.readFileSync(
        path.join(process.cwd(), "database", "data.json"),
        "UTF-8"
    );
    docs = docs ? JSON.parse(docs) : {};
    return docs;
};

let monthObj = {
    1: "Yanvar",
    2: "Fevral",
    3: "Mart",
    4: "Aprel",
    5: "May",
    6: "Iyun",
    7: "Iyul",
    8: "Avgust",
    9: "Sentyabr",
    10: "Oktyabr",
    11: "Noyabr",
    12: "Dekabr",
};

const writeDoc = ({ id }) => {
    let data = readDoc()
    data.id = id
    fs.writeFileSync(
        path.join(process.cwd(), "database", "data.json"),
        JSON.stringify(data, null, 4)
    );
    return true
}

module.exports = {
    constructor,
    readDoc,
    formatterCurrency,
    lastCurrency,
    writeDoc,
    payDate,
    schema,
    constructorStatus
};
