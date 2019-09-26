const express = require('express');
const mdAutenticacion = require('../middlewares/autenticacion');

let app = express();

let Hospital = require('../models/hospital');

// =========================
// Obtner todos los hospitales
// =========================
app.get('/', (req, res) =>{

    let desde = req.query.desde || 0;
    desde = Number(desde);

    Hospital.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .exec((err, hospitales) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error cargando hospitales',
                    errors: err
                })
            }

            Hospital.countDocuments({}, (err, total) =>{
                res.status(200).json({
                    ok: true,
                    hospitales,
                    total
                });
            });
        });
});

// =========================
// Crear un hospital
// =========================
app.post('/', mdAutenticacion.verficaToken, (req, res) => {

    let body = req.body;

    let hospital = new Hospital({
        nombre: body.nombre,
        usuario: req.usuario._id
    });

    hospital.save((err, hospitalDB) =>{
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear hospital',
                errors: err
            })
        }

        res.status(201).json({
            ok: true,
            hospital: hospitalDB
        });
    });
});

// =========================
// Actualizar un usuario
// =========================
app.put('/:id', mdAutenticacion.verficaToken, (req, res) =>{

    let id = req.params.id;
    let body = req.body;

    Hospital.findById( id, (err, hospital) =>{

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar el hospital',
                errors: err
            });
        }

        if(!hospital){
            return res.status(400).json({
                ok: false,
                mensaje: 'El hosptal con el ' + id + 'no existe',
                errors: {message: 'El hosptal con el ' + id + 'no existe'}
            }); 
        }

        hospital.nombre = body.nombre;
        hospital.img = body.img;
        hospital.usuario = req.usuario._id;

        hospital.save( (err, hospitalDB) =>{
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar hospital',
                    errors: err
                })
            }
    
            res.status(200).json({
                ok: true,
                hospital: hospitalDB
            });
        });
    });
});

// =========================
// Eliminar un hospital
// =========================
app.delete('/:id', mdAutenticacion.verficaToken, (req, res) =>{

    let id = req.params.id;

    Hospital.findByIdAndRemove( id, (err, hospitalBorrado) =>{
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar hospital',
                errors: err
            })
        }

        if (!hospitalBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un hospital con el id: ' + id,
                errors: {message: 'No existe un hospital con el id: ' + id}
            })
        }

        res.status(200).json({
            ok: true,
            hospital: hospitalBorrado
        });
    })
});

module.exports = app;