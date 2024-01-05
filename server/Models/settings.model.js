const mongoose = require("mongoose");

const settingSchema = new mongoose.Schema({
    title: {
        type: String,
    },
    link: {
        type: String,
    }
});

module.exports = mongoose.model("setting", settingSchema);