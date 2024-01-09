const webPush = require('web-push');
require('dotenv').config();
const {WEB_PUSH_PR,WEB_PUSH_PB} = process.env

webPush.setVapidDetails(
    `mailto:babeckiy88@gmail.com`,
    WEB_PUSH_PB,
    WEB_PUSH_PR
);

let subscriptions = {}

module.exports.Subscribe = async (req, res, next) => {
    try {

        const {subscription, id} = req.body;

        subscriptions[id] = subscription;
        return res.status(201).json({data: {success: true}});

    } catch (error) {
        console.error(error);
    }
};

module.exports.SendNotificaiton = async (req, res, next) => {
    try {
        const {message, title, id} = req.body;

        const subscription = subscriptions[id];

        const payload = JSON.stringify({ title, message });

        webPush.sendNotification(subscription, payload)
            .catch(error => {
                return res.status(400).json({data: {success: false}});
            })
            .then((value) => {
                return res.status(201).json({data: {success: true}});
            });
    } catch (error) {
        console.error(error);
    }
};