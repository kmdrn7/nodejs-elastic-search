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
        console.error('Everything is yokai :)');
    }
})