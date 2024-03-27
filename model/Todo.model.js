const mongoose = require("mongoose");
const TodoSchema = new mongoose.Schema({
    todo_id: {
        type: String,
        required: true,
        unique: true,
    },
    title: {
        type: String,
        required: true
    },
    created_by: {
        type: String,
        required: true
    },
    created_date: {
        type: Date,
        required: true,
        default: Date.now
    },
    dead_line: {
        type: Date,
        required: true,
    },
    context: {
        type: String,
        required: true,
    },
    progress: {
        type: String,
        required: true,
        enum: ["finished", "progress", "good to go"],
        default: "progress"
    }
},);

const Todo = mongoose.model("Todo", TodoSchema);

module.exports = Todo;
