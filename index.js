var express = require("express");
var bodyParser = require("body-parser"),
    methodOverride = require("method-override"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    passportLocal = require("passport-local");
var Note = require("./models/note.js"),
    User = require("./models/user.js");




var portNumber = 3060;


var app = express();

app.use(express.static("public/styles"));
mongoose.connect("mongodb://localhost/noted_sample");
mongoose.set('useFindAndModify', false);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.set("view engine", 'ejs');
app.use(require('express-session')({
    secret: "salt",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new passportLocal(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



// home page redirect
app.get('/', function (req, res) {
    res.redirect("/notes");
});





//log in form
app.get("/login", function (req, res) {
    res.render('login');
});



// sign up form
app.get("/signup", function (req, res) {
    res.render("signup");
});



// log in logic
app.post("/login", passport.authenticate("local", {
    successRedirect: '/notes',
    failureRedirect: "/login",
    failureFlash: false,
}), function (req, res) {
}
);




// log out the current user
app.get('/logout', function (req, res) {
    req.logOut();
    res.redirect('/login');
})



//sign up logic
app.post("/signup", function (req, res) {
    User.register(new User({ username: req.body.username }), req.body.password, function (err, user) {
        if (err) {
            console.log(err);
        } else {
            passport.authenticate('local')(req, res, function () {
                // logged in, implement something now
                console.log(user);
                res.redirect('/notes')
            });
        }
    });
});





// for creating a new note, post req.
app.post('/notes', isLoggedIn, function (req, res) {

    var note = {
        title: req.body.note.title,
        body: req.body.note.body,
        author: {
            id: req.user._id,
            username: req.user.username,
        }
    };

    Note.create(note, function (error, note) {
        if (error) {
            console.log(error);
        }
        else {
            req.user.notes.push(note);
            req.user.save();
            res.redirect('/notes');
        }
    });
});


//basic home page
app.get('/notes', isLoggedIn, function (req, res) {
    User.findById(req.user.id).populate("notes").exec(function (err, user) {
        if (err) {
            console.log(err);
        } else {
            res.render('list.ejs', { notes: user.notes })
        }
    })
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
        body: req.body.editnote.body,
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





// is loggedin middlewear
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect('/login');
    }

}



// server listener
app.listen(portNumber, function () {
    console.log("the server is up and listening.");
});