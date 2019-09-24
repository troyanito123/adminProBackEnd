// importaciones
const express = require('express');
const mongoose = require('mongoose');

//Inicializar variables
let app = express();

// Conexion a la base de datos
mongoose.connect('mongodb://localhost:27017/hospitalDB', {useNewUrlParser: true, useUnifiedTopology: true}, (err, res) =>{
    if(err) throw err;
    console.log('Base de datos: \x1b[32m%s\x1b[0m',' Online');
});

// Rutas
app.get('/', (req, res, next) =>{
    res.status(200).json({
        ok: true,
        mensaje: 'Peticion realizada correctamene'
    })
});

// Escuchar peticiones
app.listen(3000, () =>{
    console.log('Express server corriendo en puerto: \x1b[32m%s\x1b[0m',' 3000');
});