const mongoose = require("mongoose");
const Todo = require("./Todo.model");

const userSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    created_note: [{
        type: String,
        ref: "Todo"
    }]
});

const User = mongoose.model('User', userSchema);

module.exports = User;
