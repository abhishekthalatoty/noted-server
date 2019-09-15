var mongoose = require("mongoose");


var noteSchema = new mongoose.Schema({
    title: String,
    body: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }

});



var Note = mongoose.model("Note", noteSchema);

module.exports = Note;