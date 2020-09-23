const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Models = require('./models.js');
const passport = require('passport');
require('./passport');
const cors = require('cors');
const bcrypt = require('bcrypt');
const { check, validationResult } = require('express-validator');
const uuid = require("uuid");

const Movies = Models.Movie;
const Users = Models.User;

//mongoose.connect('mongodb://localhost:27017/test', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connect('process.env.CONNECTION_URI', { useNewUrlParser: true, useUnifiedTopology: true });
app.use(morgan("common"));
app.use(bodyParser.json());

let auth = require('./auth')(app);

let allowedOrigins = ['http://localhost:8080', 'http://testsite.com', 'https://intense-taiga-38394.herokuapp.com'];

app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin) return callback(null, true)
            if (allowedOrigins.indexOf(origin) === -1) {
                // If a specific origin isn’t found on the list of allowed origins
                let message =
                    'The CORS policy for this application doesn’t allow access from origin ' +
                    origin
                return callback(new Error(message), false)
            }
            return callback(null, true)
        },
    })
)



app.get('/', (req, res) => {
    res.send('<h1>' + '<b>Hallo World<b>' + '</h1>')
})

let userSchema = mongoose.Schema({
    userName: {type: String, required: true},
    password: {type: String, required: true},
    email: {type: String, required: true},
    birthday: Date,
    FavoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }]
});

userSchema.statics.hashPassword = (password) => {
    return bcrypt.hashSync(password, 10);
};

userSchema.methods.validatePassword = function(password) {
    return bcrypt.compareSync(password, this.Password);
};
// Get list of movies
// Get all users
app.get('/movies', passport.authenticate('jwt', { session: false }), (req, res) => {
    Movies.find()
        .then((movies) => {
            res.status(201).json(movies);
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send('Error: ' + error);
        });
});

//Get data about a single movie by name
app.get("/movies/:Title", passport.authenticate('jwt', { session: false }),(req, res) => {
        Movies.findOne({ Title: req.params.Title })
            .then((movie) => {
                res.json(movie);
            })
            .catch((err) => {
                res.status(500).send("Error: " + err);
            });
    }
);

// Get the data about Genre name and description by movie title
app.get("/movies/Genre/:Title", passport.authenticate('jwt', { session: false }),(req, res) => {
        Movies.findOne({ Title: req.params.Title })
            .then((movie) => {
                res
                    .status(201)
                    .json(
                        "Genre of this movie is: " +
                        movie.Genre.Name +
                        ". " +
                        movie.Genre.Description
                    );
            })
            .catch((err) => {
                res.status(500).send("Error: " + err);
            });
    }
);

//Return data about a director

app.get("/movies/Director/:Name", passport.authenticate('jwt', { session: false }),(req, res) => {
        Movies.findOne({ "Director.Name": req.params.Name })
            .then((movies) => {
                res.json(
                    "Name: " +
                    movies.Director.Name +
                    " Bio: " +
                    movies.Director.Bio
                );
            })
            .catch((err) => {
                res.status(404).send("Error: " + err);
            });
    }
);


//User
//Allow new users to register
app.post("/users", (req, res) => {
    let hashedPassword = Users.hashPassword(req.body.Password);
    //check the validation object for errors
        Users.findOne({ Username: req.body.userName })
            .then((user) => {
                if (user) {
                    return res.status(400).send(req.body.userName + "already exists");
                } else {
                    Users.create({
                        userName: req.body.userName,
                        password: req.body.password,
                        email: req.body.email,
                        birthday: req.body.birthday
                    })
                        .then((user) => { res.status(201).json(user) })
                        .catch((error) => {
                            console.error(error);
                            res.status(500).send('Error: ' + error);
                        });
                }
            })
            .catch((error) => {
                console.error(error);
                res.status(500).send('Error: ' + error);
            });
});

//Get data about a single user by name
app.get('/users/:name',(req, res) => {
    res.json(users.find((user) => {
        return user.name === req.params.name;
    }));
});


//Allow existing users to deregister
app.delete('/users/:name',passport.authenticate('jwt', { session: false }),(req, res) => {
        Users.findOneAndRemove({ userName: req.params.name })
            .then((user) => {
                if (!user) {
                    res.status(400).send(req.params.Username + " was not found");
                } else {
                    res.status(200).send(req.params.Username + " was deleted.");
                }
            })
            .catch((err) => {
                res.status(500).send("Error: " + err);
            });
    }
);
//Allow users to update a user info

app.put("/users/:userName", (req, res) => {
        Users.findOneAndUpdate(
            { userName: req.params.userName },
            {
                $set: {
                    username: req.body.userName,
                    password: req.body.password,
                    email: req.body.email,
                    birthday: req.body.birthday,
                }
            },
            { new: true },
            (err, updatedUser) => {
                if (err) {
                    res.status(201).send('User ' + req.params.name + " was updated");
                } else {
                    res.json(updatedUser);
                }
            }
        );
    }
);


//Allow users to add a movie to their list of favorites
app.post('/users/:name/movies/:_id', (req, res) => {
    Users.findOneAndUpdate(
        { userName: req.params.name },
        { $push: { FavoriteMovies: req.params._id } },
        { new: true },
        (err, updatedUser) => {
            if (err) {
                res.status(500).send("Error: " + err);
            } else {
                res.json(updatedUser);
            }
        }
    );
});

//Allow users to delete a movie to their list of favorites
app.delete('/users/:name/movies/:_id', (req, res) => {
    Users.findOneAndUpdate(
        { userName: req.params.name },
        { $pull: { FavoriteMovies: req.params._id } },
        { new: true },
        (err, updatedUser) => {
            if (err) {
                res.status(500).send("Error: " + err);
            } else {
                res.json(updatedUser);
            }
        }
    );
});


/* error handling*/
app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).send("Error: Check your requested URL and try again.");
    next();
});

//use express public
app.use('/documentation.html', express.static('public'));

// listen for requests
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0',() => {
    console.log('Listening on Port ' + port);
});


