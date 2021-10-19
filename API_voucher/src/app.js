const express = require('express');
const app = express();

//midleware
app.use(express.json());
app.use(express.urlencoded({extends:false}));
//routes
app.use(require('./routes/index'));

app.listen(4000);
console.log('Server en puerto 4000');