const { Subscribe,SendNotificaiton} = require("../Controllers/notification.controller");
const router = require("express").Router();

router.post("/subscribe", Subscribe);
router.post('/send', SendNotificaiton);

module.exports = router;