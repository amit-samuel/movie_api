const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;
mongoose.connect('mongodb://localhost:27017/myFlixDB', { useNewUrlParser: true, useUnifiedTopology: true });

const express = require("express"),
    bodyParser = require("body-parser"),
    uuid = require("uuid");
const morgan = require("morgan");
const app = express();

app.use(bodyParser.json());
app.use(morgan("common"));

// Get list of movies
// Get all users
app.get('/movies', (req, res) => {
    Movies.find()
        .then((Movies) => {
            res.status(201).json(Movies);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

//Get data about a single movie by name
app.get('/movies/:name', (req, res) => {
    res.json(movies.find((movie) => {
        return movie.name === req.params.name;
    }));
});

//Return data about a director
app.get('/:movie/director/:nameDir', (req, res) => {
    let dir = movies.find((dir) => { return dir.director.nameDir === req.params.nameDir});
    console.log(dir);
    if(dir){
        res.status(201).send("Director name was found" + "\n " + dir.director.nameDir + "\n"  + dir.director.birthday);
    } else {
        res.status(404).send('Director with the name ' + req.params.nameDir + ' was not found.');
    }
});






//User
//Add a user
/* We’ll expect JSON in this format
{
  ID: Integer,
  Username: String,
  Password: String,
  Email: String,
  Birthday: Date
}*/
app.post('/users', (req, res) => {
    Users.findOne({ userName: req.body.userName })
        .then((user) => {
            if (user) {
                return res.status(400).send(req.body.userName + 'already exists');
            } else {
                Users
                    .create({
                        userName: req.body.userName,
                        Password: req.body.Password,
                        Email: req.body.Email,
                        Birthday: req.body.Birthday
                    })
                    .then((user) =>{res.status(201).json(user) })
                    .catch((error) => {
                        console.error(error);
                        res.status(500).send('Error: ' + error);
                    })
            }
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send('Error: ' + error);
        });
});

//Get data about a single user by name
app.get('/users/:name', (req, res) => {
    res.json(users.find((user) => {
        return user.name === req.params.name;
    }));
});

//Allow new users to register
app.post('/users', (req, res) => {
    let newUser = req.params.body;
    if(!newUser.name){
        const message = "Missing name in request body";
        res.status(400).send(message);
    } else {
        newUser.id = uuid.v4();
        users.push(newUser);
        res.status(201).send(newUser);
    }
});


//Allow existing users to deregister
app.delete('/users/:name', (req, res) => {
    let user = users.find((user) => { return user.name === req.params.name});
    if(user){
        users = users.filter((obj) => {return user.name === req.params.name});
        res.status(201).send('User ' + req.params.name + ' was deleted');
    }
});
//Allow users to update a user info
app.put('/users/:id', (req, res) => {
    console.log(req.params.id);
    let user = users.find((user) => {return user.id == req.params.id});
    console.log(user);
    if(user){
            user.name =  req.body.name,
            user.password = req.body.password,
            user.email = req.body.email,
            user.birthday = req.body.birthday,
            res.status(201).send('User ' + req.params.name + " was updated");
    } else {
        res.status(404).send('User ' + req.params.name + ' was not found.')
    }
});


//Allow users to add a movie to their list of favorites
app.post('/users/:name/favorites/:movie_id', (req, res) => {
    let user = users.find((user) => {
        const { movie_id} = req.params;
        let exist = user.favorites.find(favoriteid => favoriteid == movie_id)
        if(!exist){
            user.favorites.push(movie_id);
            return res.status(200).send('User favorite ' + movie_id + ' was added.');
        }
        return res.status(200).send('User favorite already exist');

    })

});

//Allow users to delete a movie to their list of favorites
app.delete('/users/:name/favorites/:movie_id', (req, res) => {
    let user = users.find((user) => {
        const { movie_id} = req.params;
        const index = user.favorites.indexOf(movie_id);
        if (index > -1) {
            user.favorites.splice(index, 1);
        }
        console.log(user);
        return res.status(200).send('User favorite deleted');

    })
});



//use express public
app.use('/documentation.html', express.static('public'));

// listen for requests
app.listen(8080, () =>
    console.log('Your app is listening on port 8080.')
);