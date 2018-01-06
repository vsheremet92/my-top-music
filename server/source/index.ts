import * as express from 'express'
import * as bodyParser from 'body-parser'
import * as mongo from 'mongodb'

const app = express();
const MongoClient = mongo.MongoClient;
const url = 'mongodb://localhost:27017';
const dbName = 'my-top-music';

app.use(express.static('../../../valerii/Projects/my-top-music/client/build'));
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req, res)=> {
    res.sendFile('index.html');
});

app.post('/quotes', (req, res)=> {
    console.log(`Received next data: name - ${req.body.name}, quote - ${req.body.quote}`);
    res.redirect('/');
});

const findDocuments = function(db, callback) {
    const collection = db.collection(dbName);
    collection.find().toArray((err, res)=> {
        console.log(res);
    })
    /*collection.insertMany([{a : 1}, {a : 2}, {a : 3}], (err, result)=> {
        console.log("Inserted 3 documents into the collection");
        callback(result);
    });*/
}

MongoClient.connect(url, (err, client)=> {
    console.log("Connected successfully to database");
    const db = client.db(dbName);
    findDocuments(db, ()=> {
        client.close();
    });
    app.listen(5000, ()=> {
        console.log('Server running on 5000');
    });
});
