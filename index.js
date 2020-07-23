const express = require('express'),
    morgan = require('morgan');
const app = express();
app.use(morgan('common'));

//movie Object
let getMovie = [
    {
        movie: 'Bad Boys',
        year: '1995'
    },
    {
        movie: 'Bad Boys for life',
        year: '2020'
    },
    {
        movie: 'Lord of the Rings',
        year: '2001'
    },
    {
        movie: 'Lord of the Rings 2',
        year: '2002'
    },
    {
        movie: 'Lord of the Rings 3',
        year: '2003'
    },
    {
        movie: 'Star Wars IV',
        year: '1977'
    },
    {
        movie: 'Star Wars V',
        year: '1980'
    },
    {
        movie: 'Star Wars VI',
        year: '1983'
    },
    {
        movie: 'Star Wars I',
        year: '1999'
    },
    {
        movie: 'Star Wars II',
        year: '2002'
    },
    {
        movie: 'Star Wars III',
        year: '2005'
    },
    {
        movie: 'Star Wars: The Force Awakens',
        year: '2015'
    },
    {
        movie: 'Star Wars: The Last Jedi',
        year: '2017'
    },
    {
        movie: 'Star Wars: The Rise of Skywalker',
        year: '2019'
    }

];

// GET requests
app.get('/', (req, res) => {
    res.send('Welcome to my movie club!');
});

app.get('/movie', (req, res) => {
    res.json(getMovie);
});
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