const express = require("express");
bodyParser = require("body-parser");
uuid = require("uuid");
const morgan = require("morgan");
const app = express();
require('dotenv').config()

/* app.use initializations */
app.use(bodyParser.json());
app.use(morgan("common")); /*Logging with Morgan*/
app.use(express.static("public"));

/* install validator*/
const { check, validationResult } = require("express-validator");

/*Authentication(passport) and Authorization(auth)*/
const passport = require("passport");
require("./passport");
const auth = require("./auth")(app);

/*Integrating Mongoose with a REST API*/
const mongoose = require("mongoose");
const Models = require("./models.js");
Movies = Models.Movie;
Users = Models.User;
Genres = Models.Genre;
Directors = Models.Director;

/* Mongoose local data base connection*/
/*mongoose.connect('mongodb://localhost:27017/myFlixDB', { useNewUrlParser: true, useUnifiedTopology: true })*/

/* MongoDB Atlas and Heroku data base connection*/
mongoose.connect(process.env.CONNECTION_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}); /* URL from MongoDB atlas*/

/* installed CORS */
const cors = require("cors");
app.use(
    cors({
        origin: function (origin, callback) {
            if (!origin) return callback(null, true);
            if (allowedOrigins.indexOf(origin) === -1) {
                /* If a specific origin is not found on the list of allowed origins*/
                let message =
                    "The CORS policy for this application does not allow access from origin " +
                    origin;
                return callback(new Error(message), false);
            }
            return callback(null, true);
        },
    })
);


let allowedOrigins = ['http://localhost:8080',
    'http://testsite.com',
    'https://intense-taiga-38394.herokuapp.com',
    'https://myflixmovieapp.herokuapp.com'];



app.get('/', (req, res) => {
    res.send('<h1>' + '<b>Hallo World<b>' + '</h1>')
})



// Get list of movies
// Get all users
app.get('/movies', (req, res) => {
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
app.get("/movies/:Title", passport.authenticate('jwt', { session: false }), (req, res) => {
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
app.get("/movies/Genre/:Title", passport.authenticate('jwt', { session: false }), (req, res) => {
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

app.get("/movies/Director/:Name", passport.authenticate('jwt', { session: false }), (req, res) => {
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
app.post('/users', (req, res) => {
    let hashedPassword = Users.hashPassword(req.body.Password);
    Users.findOne({ Username: req.body.Username }) // Search to see if a user with the requested username already exists
        .then((user) => {
            if (user) {
                //If the user is found, send a response that it already exists
                return res.status(400).send(req.body.Username + ' already exists');
            } else {
                Users
                    .create({
                        Username: req.body.Username,
                        Password: hashedPassword,
                        Email: req.body.Email,
                        Birthday: req.body.Birthday
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

// Get user by username
app.get("/users/:Username", (req, res) => {

    Users
        .findOne({ Username: req.params.Username })
        .then(user => {
            res.json(user);
        })
        .catch(err => {
            console.error(err);
            res
                .status(500)
                .send("Error: " + err);
        })
})


//Allow existing users to deregister
app.delete('/users/:name', passport.authenticate('jwt', { session: false }), (req, res) => {
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
app.put(
    "/users/:Username",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        Users.findOneAndUpdate(
            { Username: req.params.Username },
            {
                /*Allows User To Update Their Info*/
                $set: {
                    Username: req.body.Username,
                    Password: hashedPassword,
                    Email: req.body.Email,
                    Birthday: req.body.Birthday,
                },
            },
            { new: true },
            function (error, updatedUser) {
                if (error) {
                    console.error(error);
                    res.status(500).send("Error: " + error);
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
        { Username: req.params.name },
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
        { Username: req.params.name },
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
app.listen(port, '0.0.0.0', () => {
    console.log('Listening on Port ' + port);
});