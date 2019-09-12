const express = require("express");
const mongoose=require("mongoose");
const Note =require("./notes");
const db = require("./db");
var bodyParser = require("body-parser"),
    methodOverride = require("method-override");
var portNumber =  5060;
var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));



const note=new Note({
    _id:new mongoose.Types.ObjectId(),
    title:"note title",
    body:"note body"
});


app.get('/',  (req, res)=> {
    res.redirect("/notes");
});


// get all notes
app.get('/', (req, res) => {
   db.getDB().collection(collection)
        .find({}).toArray((err, documents) => {
            if (err)
                console.log(err);
            else {
                res.json(documents);
            }
        });
   
});
//post note
app.post('/notes', (req, res) => {
    const newnote = new Note({
        _id:new mongoose.Types.ObjectId(),
        title:req.body.note.title,
        body:req.body.note.body
    });
    newnote.save().then(result =>{
         notes.push(newnote),
         console.log(newnote),
        res.redirect('/notes')})
       .catch(err =>console.log(err)); 

} )   
        
  
//middle ware
app.use((err, req, res, next) => {
    res.status(err.status).json({
        error: {
            message: err.message
        }
    });
})



//basic home page
app.get('/notes',  (req, res) =>{
    res.render('list.ejs', {Note: documents});
})



// new note page
app.get('/notes/new', function (req, res) {
    res.render('new.ejs');
});


//put to edit

app.put('/notes/:id/edit', (req, res) => {

    db.getDB().collection(collection).findOneAndUpdate({ _id: db.getPrimaryKey(req.params.id) }, { $set: { todo: req.body.req.params.id } }, { returnOriginal: false }, (err, result) => {
        if (err)
            console.log(err);
        else {
            res.render('noteedit.ejs');
        }
    });
});


// open, show each note
app.get('/notes/:id', (req, res) => {
    db.getDB().collection(collection)
        .findOne({ _id: db.getPrimaryKey(req.params.id) }), (err, result) => {
            if (err)
            res.render('note.ejs', { Note: documents });
            else
            res.render('noteedit.ejs', { Node: result});
               
        };
    });

    // delete the note
    app.delete('/notes/:id', (req, res) => {

        db.getDB().collection(collection).findOneAndDelete({ _id: db.getPrimaryKey(req.params.id) }, (err, result) => {
            if (err)
                console.log(err);
            else
            res.render('list.ejs', { Note: documents });   
        });
    });
//database connection
    db.connect((err) => {

        if (err) {
            console.log('unable to connect to database');
            process.exit(1);
        }

        else {
            app.listen(portNumber, () => {
                console.log('connected to database');
            });
        }
    });

