const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    title: {
        type: String,
    },
    description: {
        type: String,
    },
    image: {
        type: String,
    },
    options: {
        type: Array,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'category',
    },
});

module.exports = mongoose.model("products", productSchema);