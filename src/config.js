const TelegramAPi = require("node-telegram-bot-api");

let conn_params = {
    serverNode: '212.83.155.144:30015',
    uid: 'SYSTEM',
    pwd: 'K3w2neCY',
};

let token = '5988929303:AAHx58MwiLz8utvNsjwSu9hAddcorw5fkbU'

const bot = new TelegramAPi(token, {
    polling: true,
});



module.exports = { conn_params, bot }