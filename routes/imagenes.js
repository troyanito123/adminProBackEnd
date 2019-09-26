const express = require('express');
const path = require('path');
const fs = require('fs');

let app = express();

app.get('/:tipo/:img', (req, res) =>{

    let tipo = req.params.tipo;
    let img = req.params.img;

    let pathImagen = path.resolve( __dirname, `../uploads/${tipo}/${img}`);

    if(fs.existsSync(pathImagen)){
        res.sendFile( pathImagen );
    }else{
        let pathNoImagen = path.resolve( __dirname, '../assets/no-img.jpg' );
        res.sendFile( pathNoImagen );
    }
});

module.exports = app;