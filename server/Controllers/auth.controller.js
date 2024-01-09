const User = require("../Models/user.model");
const { createSecretToken } = require("../util/SecretToken");
const bcrypt = require("bcryptjs");
const {updatePassword} = require("./manager.controller");
const jsonData = require("../errorMessage.json");

function getMessageByErrorCode(errorCode) {
    const result = jsonData.find(item => item.errorCode === errorCode);
    return result ? result.message : " ";
}

module.exports.Signup = async (req, res, next) => {
    try {
        const { password, username, createdAt } = req.body;
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.json({ message: "User already exists" });
        }
        const user = await User.create({ password, username, createdAt });
        const token = createSecretToken(user._id);
        res.cookie("token", token, {
            withCredentials: true,
            httpOnly: false,
        });
        res
            .status(201)
            .json({ message: "The user is registered", success: true, user });
    } catch (error) {
        console.error(error);
    }
};

module.exports.updatePassword = async (req, res, next) => {
    try {
        const { isPassword } = req.body;

        if(isPassword.password !== isPassword.repeatPassword){
            return res.json({ message: getMessageByErrorCode(27), success: false });
        }

        if(isPassword.password.length < 7){
            return res.json({ message: getMessageByErrorCode(26), success: false });
        }
        const newPassword = await bcrypt.hash(isPassword.password, 12);
        const changePassword = await User.updateOne({ password:newPassword });

        return res.json({ message: getMessageByErrorCode(25), success: true });
    } catch (error) {
        console.error(error);
    }
};

module.exports.Login = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        if(!username || !password ){
            return res.json({message:getMessageByErrorCode(24)})
        }
        const user = await User.findOne({ username });
        if(!user){
            return res.json({message:getMessageByErrorCode(23) })
        }
        const auth = await bcrypt.compare(password,user.password)
        if (!auth) {
            return res.json({message:getMessageByErrorCode(22) })
        }
        const token = createSecretToken(user._id);

        res.cookie("token", token, {
            withCredentials: true,
            httpOnly: false,
        });

        res.status(201).json({ message: getMessageByErrorCode(21), success: true });
    } catch (error) {
        console.error(error);
    }
}

module.exports.Logout = async (req, res, next) => {
    try {
        res.clearCookie('token')
        res.status(201).json({ message: getMessageByErrorCode(20), success: true });

    } catch (error) {
        console.error(error);
    }
}
