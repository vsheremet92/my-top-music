import * as express from 'express'
let app = express();

app.use(express.static('../../../valerii/Projects/my-top-music/client/build'));

app.get('/', (req, res)=> {
    res.sendFile('index.html');
});

app.listen(5000, function () {
    console.log('App listening');
})
