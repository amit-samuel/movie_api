const express = require('express'),
    //morgan = require('morgan');
    podyParser = require('body-parser'),
    uuid = require('uuid');
const app = express();
//app.use(morgan('common'));

//movie Object
let movies = [
    {
        id: 1,
        name: 'Bad Boys',
        year: '1995',
        zahlen: {
            Budget: 19,
            Box : 389.1
        }
    },
    {
        id: 2,
        name: 'Bad Boys for life',
        year: '2020',
        zahlen: {
            Budget: 19,
            Box : 389.1
        }
    },
    {
        id: 3,
        name: 'Lord of the Rings',
        year: '2001',
        zahlen: {
            Budget: 19,
            Box : 389.1
        }
    },
    {
        id: 4,
        name: 'Lord of the Rings 2',
        year: '2002',
        zahlen: {
            Budget: 19,
            Box : 389.1
        }
    },
    {
        id: 5,
        name: 'Lord of the Rings 3',
        year: '2003',
        zahlen: {
            Budget: 19,
            Box : 389.1
        }
    },
    {
        id: 6,
        name: 'Star Wars IV',
        year: '1977',
        zahlen: {
            Budget: 19,
            Box : 389.1
        }
    },
    {
        id: 7,
        name: 'Star Wars V',
        year: '1980',
        zahlen: {
            Budget: 19,
            Box : 389.1
        }
    },
    {
        id: 8,
        name: 'Star Wars VI',
        year: '1983',
        zahlen: {
            Budget: 19,
            Box : 389.1
        }
    },
    {
        id: 9,
        name: 'Star Wars I',
        year: '1999',
        zahlen: {
            Budget: 19,
            Box : 389.1
        }
    },
    {
        id: 10,
        name: 'Star Wars II',
        year: '2002',
        zahlen: {
            Budget: 19,
            Box : 389.1
        }
    },
    {
        id: 11,
        name: 'Star Wars III',
        year: '2005',
        zahlen: {
            Budget: 19,
            Box : 389.1
        }
    },
    {
        id: 12,
        name: 'Star Wars: The Force Awakens',
        year: '2015',
        zahlen: {
            Budget: 19,
            Box : 389.1
        }
    },
    {
        id: 13,
        name: 'Star Wars: The Last Jedi',
        year: '2017',
        zahlen: {
            Budget: 19,
            Box : 389.1
        }
    },
    {
        id: 14,
        name: 'Star Wars: The Rise of Skywalker',
        year: '2019',
        zahlen: {
            Budget: 19,
            Box : 389.1
        }
    }

];

// Get list of movies
app.get('/movies', (req, res) => {
    res.json(movies);
});

//Get data about a single movie by ID
app.get('/movies/:id', (req, res) =>{
    res.json(movies.find((movie) => {
        return movies.id === req.params.id;
    }));
});

//Get release date Of a movie
app.get('/movies/:year', (req, res) => {
   res.json(movies.find((year) => {return movies.year = req.params.year}));
});


// Add movie
app.post('/movies', (req, res) => {
    let newMovie = req.body;

    if (!newMovie.name) {
        const message = 'Missing name in request body';
        res.status(400).send(message);
    } else {
        newMovie.id = uuid.v4();
        movies.push(newMovie);
        res.status(201).send(newMovie);
    }
});

//Remove a movie by id
app.delete('/movies/:id', (req, res) => {
    let movie = movies.find((movie) => { return movie.id === req.params.id});
    if(movie){
        movies = movies.filter((obj) => { return obj.id === req.params.id});
        res.status(201).send('Movie '+ req.params.id + ' was deleted');
    }
});

//Update a zahlen name in movie





//error hendeling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

//use express public
app.use('/documentation.html', express.static('public'));

// listen for requests
app.listen(8080, () =>
    console.log('Your app is listening on port 8080.')
);