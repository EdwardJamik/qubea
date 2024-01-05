const { Signup,Login, Logout} = require("../Controllers/auth.controller");
const {userVerification} = require("../Middlewares/auth.middleware");
const router = require("express").Router();

router.post("/signup", Signup);
router.post('/login', Login);
router.post('/logout', Logout);
router.post('/',userVerification)

module.exports = router;