// const { Telegraf, Scenes } = require('telegraf')
// const {message} = require("telegraf/filters");
// const Order = require("./Models/order.model");
// require('dotenv').config()
//
// const { BOT_TOKEN } = process.env
//
// const bot = new Telegraf(`${BOT_TOKEN}`)
//
// bot.on(message, async ctx => {
//     try {
//         const callback = ctx?.update?.callback_query?.data
//         const callback_check = callback?.split('-');
//
//         if(callback_check[0] === 'accept'){
//             await Order.updateOne({ _id:callback_check[1] }, {accepting:true});
//             ctx.editMessageReplyMarkup({ inline_keyboard: [
//                     [{ text: 'End Order', callback_data:`end-${callback_check[1]}` }]
//                 ]})
//         }
//         else if(callback_check[0] === 'end'){
//             await Order.updateOne({ _id:callback_check[1] }, {waiting:true,success:true});
//             ctx.editMessageReplyMarkup({ inline_keyboard: [
//                     [{ text: '✅', callback_data:`${callback_check[1]}` }]
//                 ]})
//         }
//         else if(callback_check[0] === 'cancel'){
//             await Order.updateOne({ _id:callback_check[1] }, {cancel:true});
//             ctx.editMessageReplyMarkup({ inline_keyboard: [
//                     [{ text: '❌', callback_data:`${callback_check[1]}` }]
//                 ]})
//         }
//
//     } catch (e) {
//         console.error(e)
//     }
// })
//
// module.exports = bot
