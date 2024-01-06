const User = require("../Models/user.model");
const { createSecretToken } = require("../util/SecretToken");
const bcrypt = require("bcryptjs");

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

module.exports.Login = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        if(!username || !password ){
            return res.json({message:'Fill in all fields'})
        }
        const user = await User.findOne({ username });
        if(!user){
            return res.json({message:'Invalid username or password' })
        }
        const auth = await bcrypt.compare(password,user.password)
        if (!auth) {
            return res.json({message:'Invalid username or password' })
        }
        const token = createSecretToken(user._id);

        console.log(token)

        res.cookie("token", token, {
            withCredentials: true,
            httpOnly: false,
        });

        res.status(201).json({ message: "User is successfully authorized", success: true });
    } catch (error) {
        console.error(error);
    }
}

module.exports.Logout = async (req, res, next) => {
    try {
        res.clearCookie('token')
        res.status(201).json({ message: "User logged in successfully", success: true });

    } catch (error) {
        console.error(error);
    }
}
