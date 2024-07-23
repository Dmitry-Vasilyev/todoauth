const {Schema, model} = require('mongoose');


const todoSchema = new Schema({
    title: String,
    text: String
});

module.exports = model("Todo", todoSchema);