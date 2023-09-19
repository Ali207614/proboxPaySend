const {
    START,
} = require("../repositories/dataRepositories");
const dbService = require("../services/dbService");
let moment = require("moment");
const axios = require("axios");
const { constructor, writeDoc, payDate, schema } = require("../helpers");
const { bot } = require("../config");
let chatId = '561932032'

exports.fetchResults = async function ({ id }) {
    try {
        const fetchData = await dbService.executeParam(START, [id]);
        if (fetchData.length) {
            let docEntrys = [...new Set(fetchData.map(item => item.DocEntry))].sort((a, b) => b - a)
            let result = docEntrys.map(item => fetchData.filter(el => el.DocEntry == item))
            result = result.map(item => {
                let id = [...new Set(item.map(el => el.InstId))]
                return id.map(el => item.filter(data => data.InstId == el))
            })
            result?.flat().forEach(async item => {
                let data = item.find((el, i, arr) => el.InstlmntID == arr[0].InstId)
                let statusMessage = await sendMessage(data, item?.length)
                if (statusMessage.status == 200) {
                    // bot.sendMessage(chatId, await schema(data, statusMessage.data));
                    // bot.sendMessage('5329778807', await schema(data, statusMessage.data));
                }
                else {
                    bot.sendMessage(chatId, await schema(data, statusMessage.data));
                }
            })
            writeDoc({ id: docEntrys[0] })

        }
    } catch (err) {
        bot.sendMessage(chatId, `${err} fetchResults func`);
    }
};



const sendMessage = async (data, listPaymentLength = 1) => {
    try {
        let result = [];
        let userPhone = data.Phone1?.split(" ");
        let { status, month } = payDate(data)
        if (userPhone) {
            if (userPhone?.length >= 2) {
                for (let j = 0; j < userPhone.length; j++) {
                    if (userPhone[j])
                        result.push(
                            await constructor({ Phone1: userPhone[j], status, month, monthNum: data?.InstId, listPaymentLength, CardName: data?.CardName })
                        );
                }
            } else {
                result.push(
                    await constructor({ Phone1: data.Phone1, status, month, monthNum: data?.InstId, listPaymentLength, CardName: data?.CardName })
                );
            }
        }
        return sendMessageAxios(result);
    } catch (err) {
        bot.sendMessage(chatId, `${err} sendMessage func`);
    }
};




async function sendMessageAxios(data) {
    try {
        if (data.length) {
            const res = await axios.post(
                "https://send.smsxabar.uz/broker-api/send",
                {
                    messages: data.slice(0, 100),
                },
                {
                    auth: {
                        username: "zafartravel",
                        password: "iEaG)d4J5&^8",
                    },
                }
            );
            return { status: res.status, data };
        }
    } catch (err) {
        bot.sendMessage(chatId, `${err} sendMessageAxios func`);
    }
}