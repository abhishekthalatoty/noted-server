var express = require("express");
var bodyParser = require("body-parser"),
    methodOverride = require("method-override");

var portNumber = 3060;
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));



function getNoteId(list, ids) {
    var id = parseInt(ids, 10);
    for (var i = 0; i < list.length; i++) {
        if (list[i].id === id) {
            return (i);
        }
    }

};



var notes = [
    {
        id: 1,
        title: "this is your note title",
        body: "This is Note Body",
    },




];

// home page redirect
app.get('/', function (req, res) {
    res.redirect("/notes");
});



// for creating a new note, post req.
app.post('/notes', function (req, res) {

    var note = {
        id: notes.length + 1,
        title: req.body.note.title,
        body: req.body.note.body,
    };

    notes.push(note);

    res.redirect('/notes');



});


//basic home page
app.get('/notes', function (req, res) {
    res.render('list.ejs', { notes: notes });
})



// new note page
app.get('/notes/new', function (req, res) {
    res.render('new.ejs');
});


// to open edit form
app.get('/notes/:id/edit', function (req, res) {
    var oldNote = notes[getNoteId(notes, req.params.id)];
    res.render('noteedit.ejs', { note: oldNote });
});

// to set the editing and change it to database.
app.put('/notes/:id', function (req, res) {
    var note = {
        id: getNoteId(notes, req.params.id),
        title: req.body.editnote.title,
        body: req.body.editnote.body
    };

    notes[getNoteId(notes, req.params.id)] = note;

    res.redirect('/');

});


// open, show each note
app.get('/notes/:id', function (req, res) {
    var note = notes[getNoteId(notes, req.params.id)];
    res.render('note.ejs', { note: note });
})




// delete the note
app.delete('/notes/:id', function (req, res) {
    notes.splice(getNoteId(notes, req.params.id), 1);  // set it with find method. giving error. error solved, not fixed
    res.redirect('/notes');

});








// server listener
app.listen(portNumber, function () {
    console.log("the server is up and listening.");
});