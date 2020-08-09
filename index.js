const express = require("express"),
    bodyParser = require("body-parser"),
    uuid = require("uuid");
const morgan = require("morgan");
const app = express();

app.use(bodyParser.json());
app.use(morgan("common"));

//movie Object
let movies = [
    {
        movie_id: 1,
        name: 'Bad Boys',
        year: '1995',
        director: {
            nameDir: "Michael Bay",
            bio: "Directors Guild of America Award für den besten Regisseur für Werbefilme, MEHR",
            birthday: "17. Februar 1965",
        }
    },
    {
        movie_id: 2,
        name: 'Lord of the Rings',
        year: '2001',
        director: {
            nameDir: "Peter Jackson",
            bio: "Oscar, Saturn Award",
            birthday: "31. Oktober 1961",
        }
    },
    {
        movie_id: 3,
        name: 'Star Wars IV',
        year: '1977',
        director: {
            nameDir: "George",
            bio: "George Walton Lucas Jr. ist ein US-amerikanischer Produzent, Drehbuchautor und Regisseur. Seine erfolgreichsten Filmprojekte waren vor allem die Star-Wars-Filmreihe und die Indiana-Jones-Tetralogie",
            birthday: "14. Mai 1944 ",
        }
    }
];

let users = [
    {
        id: 1,
        name: 'test',
        password: 'test',
        email: 'test@test.de',
        phone: '0160000000',
        birthday: '11.03.1985',
        favorites: {

        },
    }
];

// Get list of movies
app.get('/movies', (req, res) => {
    res.json(movies);
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
    let user = users.find((user) => {return user.id === req.params.id});
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
        console.log(user.name);
        return user.name === req.params.name});
    let favorite = movies.find((favorite) => (req, res) => {
        console.log(favorite.movie_id)
        return favorit.movie_id === req.params.movie_id});
        if(user.favorites.includes(favorite.movie_id)){
            res.params.favorites = user.favorites.push(favorite.movie_id);
            res.status(201).send("Favorite is added. ");

        } else {
            const message = "Error";
            res.status(400).send(message);
        }

});


//Allow users to delete a movie to their list of favorites
app.delete('/users/:name/favorites/:movie_id', (req, res) => {
    let user = users.find((user) => {
        return user.name === req.params.name});
    let favorit = movies.find((favorit) => (req, res) => {
        return favorit.movie_id === req.params.movie_id});
    if(favorit){
        user = users.filter((obj) => { return obj.favorites.movie_id !== req.params.favorites.movie_id });
        res.status(201).send('User favorite ' + req.params.movie_id + ' was deleted.');
    } else {
        const message = "Error";
        res.status(400).send(message);

});



//use express public
app.use('/documentation.html', express.static('public'));

// listen for requests
app.listen(8080, () =>
    console.log('Your app is listening on port 8080.')
);