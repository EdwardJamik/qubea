const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    orderNumber: {
        type: Number,
    },
    product: {
        type: String,
    },
    table: {
        type: String,
    },
    accepting: {
        type: Boolean,
        default: false
    },
    cancel: {
        type: Boolean,
        default: false
    },
    waiting: {
        type: Boolean,
        default: false
    },
    success: {
        type: Boolean,
        default: false
    },
    subscribeId: {
        type: String,
    },
    message_id: {
        type: String,
    },
    option:{
        type: Array,
    },
    createdAt: {
        type: Date,
        default: new Date(),
    },
},{ timestamps: true })

module.exports = mongoose.model("order", orderSchema);