const {Pool} = require('pg');
const pool = new Pool({
    host:'10.203.101.97',
    user:'adm-rodrice',
    password: 'Mal2020',
    database:'dav12'
});

module.exports = {
    pool
}