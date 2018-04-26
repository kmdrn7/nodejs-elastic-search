const elasticsearch = require('elasticsearch');
const client = elasticsearch.Client({
    hosts: ['http://localhost:9200']
});
const bodyParser = require('body-parser');
const express = require('express');
const path = require('path');
const app = express();

client.ping({
    requestTimeout: 30000,
}, (err) => {
    if (err){
        console.error("Elasticsearch cluster is down!");
    } else {
        console.log("Elasticsearch cluster is fine :D");
    }
});

// gunakan body parser sebagai middleware
app.use(bodyParser.json());
// set port yang bisa digunakan aplikasi
app.set('port', process.env.PORT || 3001);
app.use( express.static( path.join(__dirname, 'public')));
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Methods", "Origin, X-Request-With, Content-Type, Accept");
    next();
})

app.get('/', (req, res) => {
    res.sendFile('template.html', {
        root: path.join(__dirname, 'views')
    })
});

// buat route untuk elastik search routing
app.get('/search', (req, res) => {
    // buat objek query untuk melakukan pencarian data dan mengembalikan
    // hanya 200 data dari hasil.
    let body = {
        size: 200,
        from: 0,
        query: {
            match: {
                name: req.query['q']
            }
        }
    }
    // lakukan pencarian dengan client elasticsearch
    client.search({index: 'elastic-data', body:body, type: 'cities_list'})
    .then( result => {
        res.send(result.hits.hits);
    })
    .catch( err => {
        console.log(err);
        res.send([]);
    });
});

app.get('/v2', function(req, res){
    res.sendFile('template2.html', {
        root: path.join( __dirname, 'views' )
    });
})

app.listen( app.get('port'), () => { console.log('Express server listening on port ' + app.get('port')); } );