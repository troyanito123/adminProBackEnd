const express = require('express');
const mdAutenticacion = require('../middlewares/autenticacion');

let app = express();

let Medico = require('../models/medico');

// =========================
// Obtner todos los medicos
// =========================
app.get('/', (req, res) =>{

    Medico.find({})
        .exec((err, medicos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error cargando medicos',
                    errors: err
                })
            }

            res.status(200).json({
                ok: true,
                medicos
            });
        });
});

// =========================
// Crear un Medico
// =========================
app.post('/', mdAutenticacion.verficaToken, (req, res) => {

    let body = req.body;

    let medico = new Medico({
        nombre: body.nombre,
        img: body.img,
        usuario: req.usuario._id,
        hospital: body.hospital
    });

    medico.save((err, medicoDB) =>{
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear medico',
                errors: err
            })
        }

        res.status(201).json({
            ok: true,
            medico: medicoDB
        });
    });
});

// =========================
// Actualizar un medico
// =========================
app.put('/:id', mdAutenticacion.verficaToken, (req, res) =>{

    let id = req.params.id;
    let body = req.body;

    Medico.findById( id, (err, medico) =>{

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar el medico',
                errors: err
            });
        }

        if(!medico){
            return res.status(400).json({
                ok: false,
                mensaje: 'El medico con el ' + id + 'no existe',
                errors: {message: 'El medico con el ' + id + 'no existe'}
            }); 
        }

        medico.nombre = body.nombre;
        medico.img = body.img;
        medico.usuario = req.usuario._id;
        medico.hospital = body.hospital;

        medico.save( (err, medicoDB) =>{
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar medico',
                    errors: err
                })
            }
    
            res.status(200).json({
                ok: true,
                medico: medicoDB
            });
        });
    });
});

// =========================
// Eliminar un medico
// =========================
app.delete('/:id', mdAutenticacion.verficaToken, (req, res) =>{

    let id = req.params.id;

    Medico.findByIdAndRemove( id, (err, medicoBorrado) =>{
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar medico',
                errors: err
            })
        }

        if (!medicoBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un medico con el id: ' + id,
                errors: {message: 'No existe un medico con el id: ' + id}
            })
        }

        res.status(200).json({
            ok: true,
            medico: medicoBorrado
        });
    })
});

module.exports = app;