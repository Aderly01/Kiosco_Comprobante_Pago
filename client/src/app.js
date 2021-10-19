const express = require('express');
const app = express();
//midleware
app.use(express.json());
app.use(express.urlencoded({extends:false}));
//routes
app.use(require('./routes/index')); 

app.use('/resources',express.static('public'));
app.use('/resources', express.static(__dirname + '/public'));

app.set('view engine','ejs');
const { render } = require('ejs');
const { get } = require('http');

app.listen(3030, (req, res)=>{
    console.log('SERVER RUNNING IN http://localhost:3030');
});

