// importaciones
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

//Inicializar variables
let app = express();

// Body Parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Importar rutas
let appRoutes = require('./routes/app');
let usuarioRoutes = require('./routes/usuario');
let loginRoutes = require('./routes/login');
let hospitalRoutes = require('./routes/hospital');
let medicoRoutes = require('./routes/medico');

// Conexion a la base de datos
mongoose.connect('mongodb://localhost:27017/hospitalDB', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }, (err, res) =>{
    if(err) throw err;
    console.log('Base de datos: \x1b[32m%s\x1b[0m',' Online');
});

// Rutas
app.use('/usuario', usuarioRoutes);
app.use('/login', loginRoutes);
app.use('/hospital', hospitalRoutes);   
app.use('/medico', medicoRoutes);
app.use('/', appRoutes);

// Escuchar peticiones
app.listen(3000, () =>{
    console.log('Express server corriendo en puerto: \x1b[32m%s\x1b[0m',' 3000');
});