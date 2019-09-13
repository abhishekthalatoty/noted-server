var express = require("express");
var bodyParser = require("body-parser"),
    methodOverride = require("method-override"),
    mongoose = require("mongoose");

var portNumber = 3060;
var app = express();


mongoose.connect("mongodb://localhost/noted_sample");
mongoose.set('useFindAndModify', false);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));


var Note = mongoose.model("Note", new mongoose.Schema({
    title: String,
    body: String

}));


// home page redirect
app.get('/', function (req, res) {
    res.redirect("/notes");
});



// for creating a new note, post req.
app.post('/notes', function (req, res) {

    var note = {
        title: req.body.note.title,
        body: req.body.note.body,
    };

    Note.create(note, function (error, note) {
        if (error) {
            console.log(error);
        }
        else {
            res.redirect('/notes');
        }
    });
});


//basic home page
app.get('/notes', function (req, res) {
    Note.find({}, function (error, allNotes) {
        if (error) {
            console.log(error);
        }
        else {
            res.render('list.ejs', { notes: allNotes });
        }
    });
});



// new note page
app.get('/notes/new', function (req, res) {
    res.render('new.ejs');
});


// to open edit form
app.get('/notes/:id/edit', function (req, res) {
    Note.findById(req.params.id, function (error, oldNote) {
        if (error) {
            console.log(error);
        }
        else {
            res.render('noteedit.ejs', { note: oldNote });
        }
    });

});


// to set the editing and change it to database.
app.put('/notes/:id', function (req, res) {
    var note = {
        title: req.body.editnote.title,
        body: req.body.editnote.body
    };

    Note.findByIdAndUpdate(req.params.id, note, function (error, updatedNote) {
        if (error) { console.log(error); }
        else {
            res.redirect('/');
        }
    });


});


// open, show each note
app.get('/notes/:id', function (req, res) {
    Note.findById(req.params.id, function (error, foundNote) {
        if (error) {
            console.log(error);
        }
        else {
            res.render('note.ejs', { note: foundNote });

        }
    });

});




// delete the note
app.delete('/notes/:id', function (req, res) {

    Note.findByIdAndDelete(req.params.id, function (error, note) {
        if (error) {
            console.log(error);
        }
        else {
            res.redirect('/notes');

        }
    });

});








// server listener
app.listen(portNumber, function () {
    console.log("the server is up and listening.");
});