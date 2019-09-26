const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const SEED = require('../config/config').SEED;

let app = express();

let Usuario = require('../models/usuario');

// Google
const CLIENT_ID = require('../config/config').CLIENT_ID;
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);

// =======================
//  Autenticacion Google
// =======================
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    //const userid = payload['sub'];
    // If request specified a G Suite domain:
    //const domain = payload['hd'];

    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true,
    };
  }

app.post('/google', async (req, res) => {

    let token = req.body.token;
    let googleUser = await verify( token )
        .catch( e => {
            return res.status(403).json({
                ok: false,
                mensaje: 'Token no valido',
            });
        });
    
    Usuario.findOne({ email: googleUser.email }, (err, usuarioDB) =>{
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }
        if(usuarioDB){
            if (usuarioDB.google === false) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Debe de usuar su autenticacion normal',
                });
            } else {
                let token = jwt.sign({usuario: usuarioDB}, SEED, {expiresIn: 14400});

                res.status(200).json({
                    ok: true,
                    usuario: usuarioDB,
                    token,
                    id: usuarioDB._id
                });
            }
        }else{
            //el usuario no existe ... hay que crearlo
            let usuario = new Usuario();
            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password = ':)';

            usuario.save( (err, usuarioDB) =>{
                let token = jwt.sign({usuario: usuarioDB}, SEED, {expiresIn: 14400});

                res.status(200).json({
                    ok: true,
                    usuario: usuarioDB,
                    token,
                    id: usuarioDB._id
                });
            });
        }
    });


    // return res.status(200).json({
    //     ok: true,
    //     mensaje: 'Todo ok',
    //     googleUser
    // });
});

// =======================
//  Autenticacion Normal
// =======================
app.post('/', (req, res) =>{

    let body = req.body;

    Usuario.findOne({email: body.email}, (err, usuarioDB) =>{

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }

        if(!usuarioDB){
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas *email',
            });
        }

        if(!bcrypt.compareSync(body.password, usuarioDB.password)){
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas *password',
            });
        }

        // Crear un token!!
        usuarioDB.password = ':)';
        let token = jwt.sign({usuario: usuarioDB}, SEED, {expiresIn: 14400});

        res.status(200).json({
            ok: true,
            usuario: usuarioDB,
            token,
            id: usuarioDB._id
        });
    });
});

module.exports = app;