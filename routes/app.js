const express = require('express');

let app = express();

app.get('/', (req, res, next) =>{
    res.status(200).json({
        ok: true,
        mensaje: 'Peticion realizada correctamene'
    })
});

module.exports = app;