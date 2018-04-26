// require elasticsearch lib
const elasticsearch = require('elasticsearch');
// instantiate and Elasticsearch client
const client = new elasticsearch.Client({
    hosts: ['http://localhost:9200']
});

client.ping({
    requestTimeout: 30000,
}, error => {
    if (error){
        console.error('Elasticsearch cluster is down!');
    } else {
        console.log('Everything is yokai :)');
    }
});

// client.indices.create({
//     index: 'elastic-data'
// }, (err, res, status) => {
//     if (err){
//         console.log(err);
//     } else {
//         console.log('Created a new index', res);
//     }
// });

// client.index({
//     index: 'elastic-data',
//     id: '1',
//     type: 'cities_list',
//     body: {
//         "key1": "Content for key one",
//         "key2": "Content for key two",
//         "key3": "Content for key tree",
//     }
// }, (err, res, status) => {
//     console.log(res);
// });

const cities = require('./cities.json');
var bulk = [];

cities.forEach(city => {
    bulk.push({
        index: {
            _index: "elastic-data",
            _type: "cities_list",
        }
    })
    bulk.push(city);
});

client.bulk({body:bulk}, (err, res) => {
    if (err){
        console.log("Failed bulk operation".red, err);
    } else {
        console.log("Successfully imported %s".green, cities.length)
    }
})