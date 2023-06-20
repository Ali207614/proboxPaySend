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

async function constructor({ Phone1, status = false, month }) {
    let obj = {
        recipient: Phone1,
        "message-id": "abc000000001",
        sms: {
            originator: "3700",
            content: {
                text: status == 3 ? `Mahsulot uchun oldindan qilgan to’lovingiz qabul qilindi` : status ? `${month} oyi uchun qilgan to’lovingiz qabul qilindi va Siz ushbu oyda o’ynaladigan aksiyamiz ishtirokchisiga aylandingiz!` : `${month} oyi uchun qilgan to’lovingiz qabul qilindi.`
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
    console.log(schemaText)
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
    schema
};
