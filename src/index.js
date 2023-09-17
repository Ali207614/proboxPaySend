const hanaClient = require("@sap/hana-client");
const { conn_params, bot } = require("./config");
const dataController = require("./controllers");
const fs = require("fs");
const path = require("path");
const moment = require("moment");
const { formatterCurrency, readDoc } = require("./helpers");

bot.on("text", async (msg) => {
    let chat_id = msg.chat.id;
    bot.sendMessage(chat_id, "Assalomu aleykum :) ")
});
const start = async () => {
    try {

        try {

            const connection = hanaClient.createConnection();
            connection.connect(conn_params, async (err) => {
                if (err) {
                } else {
                    let docNum = readDoc()
                    let data = await dataController.fetchResults(docNum)
                }
            });
            global.connection = connection;
        } catch (e) {
            bot.sendMessage("561932032", `error bor ${e}`);
        }
    } catch (e) {
        bot.sendMessage("561932032", `error bor ${e}`);
    }
};



// setInterval(() => {
// }, 3000 * 60)
start();

