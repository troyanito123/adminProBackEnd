const express = require('express');
const bcrypt = require('bcryptjs');

const mdAutenticacion = require('../middlewares/autenticacion');

let app = express();

let Usuario = require('../models/usuario');

// =========================
// Obtner todos los usuarios
// =========================
app.get('/', (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    Usuario.find({}, 'nombre email img role')
        .skip(desde)
        .limit(5)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error cargando usuarios',
                    errors: err
                })
            }

            Usuario.countDocuments({}, (err, total) =>{

                res.status(200).json({
                    ok: true,
                    usuarios,
                    total
                });
            });

        });
});

// =========================
// Actualizar un usuario
// =========================
app.put('/:id', mdAutenticacion.verficaToken, (req, res) =>{

    let id = req.params.id;
    let body = req.body;

    Usuario.findById( id, (err, usuario) =>{

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar el usuario',
                errors: err
            });
        }

        if(!usuario){
            return res.status(400).json({
                ok: false,
                mensaje: 'El usuario con el ' + id + 'no existe',
                errors: {message: 'No existe un usuario con ese ID'}
            }); 
        }

        usuario.nombre = body.nombre;
        usuario.email = body.email;
        usuario.role = body.role;

        usuario.save( (err, usuarioDB) =>{
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar usuario',
                    errors: err
                })
            }

            usuarioDB.password = ':)';
    
            res.status(200).json({
                ok: true,
                usuario: usuarioDB
            });
        });
    });
});

// =========================
// Crear un nuevo usuario
// =========================
app.post('/', mdAutenticacion.verficaToken, (req, res) =>{

    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role
    });

    usuario.save( (err, usuarioDB) =>{
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear usuario',
                errors: err
            })
        }

        res.status(201).json({
            ok: true,
            usuario: usuarioDB,
            usuarioToken: req.usuario
        });
    });
});

// =========================
// Eliminar un usuario
// =========================
app.delete('/:id', mdAutenticacion.verficaToken, (req, res) =>{

    let id = req.params.id;

    Usuario.findByIdAndRemove( id, (err, usuarioBorrado) =>{
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar usuario',
                errors: err
            })
        }

        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un usuario con el id: ' + id,
                errors: {message: 'No existe un usuario con el id: ' + id}
            })
        }

        res.status(200).json({
            ok: true,
            usuario: usuarioBorrado
        });
    })
});

module.exports = app;