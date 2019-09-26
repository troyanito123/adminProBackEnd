const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');

let app = express();

let Usuario = require('../models/usuario');
let Hospital = require('../models/hospital');
let Medico = require('../models/medico');

// default options
app.use(fileUpload());

app.put('/:tipo/:id', (req, res) =>{

    let tipo = req.params.tipo;
    let id = req.params.id;

    // Tipos de de coleccion
    let tiposValidos = ['hospitales', 'medicos', 'usuarios'];
    if(tiposValidos.indexOf( tipo ) < 0){
        return res.status(400).json({
            ok: false,
            mensaje: 'Tipo de colección no es válida',
            errors: { message: 'Tipo de colección no es válida'}
        });
    }

    if(!req.files){
        return res.status(400).json({
            ok: false,
            mensaje: 'No seleccino ninguna imagen',
            errors: { message: 'No selecciono ninguna imagen'}
        });
    }

    // Obtener nombre del archivo
    let archivo = req.files.imagen;
    let nombreCortado = archivo.name.split('.');
    let extensionArchivo = nombreCortado[nombreCortado.length -1 ];
    extensionArchivo = extensionArchivo.toLowerCase();

    // Solo estas extenciones aceptamos
    let extencionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if(extencionesValidas.indexOf(extensionArchivo) < 0){
        return res.status(400).json({
            ok: false,
            mensaje: 'Extension no valida',
            errors: { message: 'Las extenciones validas son: ' + extencionesValidas.join(', ')}
        });
    }

    // Nombre de archivo personalizado
    let nombreArchivo = `${ id }-${ new Date().getMilliseconds() }.${extensionArchivo}`;

    //moverl el archivo del temporal en un path especifico
    let path = `./uploads/${ tipo }/${nombreArchivo}`;
    archivo.mv( path, err =>{
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al mover archivo',
                errors: err
            });
        }

        subirPorTipo(tipo, id, nombreArchivo, res);

        // res.status(200).json({
        //     ok: true,
        //     mensaje: 'Archivo movido',
        //     archivo: nombreArchivo
        // });
    })
});

function subirPorTipo(tipo, id, nombreArchivo, res){

    if( tipo === 'usuarios'){
        Usuario.findById( id, (err, usuario) =>{

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al guardar archivo',
                    errors: err
                });
            }

            if(!usuario){
                return res.status(400).json({
                    ok: false,
                    mensaje: 'No existe el id: ' + id,
                });
            }

            let pathViejo = './uploads/usuarios/' + usuario.img;
            if(fs.existsSync(pathViejo)){
                fs.unlinkSync(pathViejo);
            }
            usuario.img = nombreArchivo;
            usuario.save( (err, usuarioActualizado) =>{
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al guardar archivo',
                        errors: err
                    });
                }

                usuarioActualizado.password = ':)';

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de usuario actualizada',
                    usuario: usuarioActualizado
                });
            });

        });
    }

    if( tipo === 'hospitales'){
        Hospital.findById( id, (err, hospital) =>{

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al guardar archivo',
                    errors: err
                });
            }

            if(!hospital){
                return res.status(400).json({
                    ok: false,
                    mensaje: 'No existe el id: ' + id,
                });
            }

            let pathViejo = './uploads/hospitales/' + hospital.img;
            if(fs.existsSync(pathViejo)){
                fs.unlinkSync(pathViejo);
            }
            hospital.img = nombreArchivo;
            hospital.save( (err, hospitalActualizado) =>{
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al guardar archivo',
                        errors: err
                    });
                }

                if(!hospitalActualizado){
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'No existe el id: ' + id,
                    });
                }

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de hospital actualizada',
                    usuario: hospitalActualizado
                });
            });
        });
    }

    if( tipo === 'medicos'){
        Medico.findById( id, (err, medico) =>{

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al guardar archivo',
                    errors: err
                });
            }

            if(!medico){
                return res.status(400).json({
                    ok: false,
                    mensaje: 'No existe el id: ' + id,
                });
            }

            let pathViejo = './uploads/medicos/' + medico.img;
            if(fs.existsSync(pathViejo)){
                fs.unlinkSync(pathViejo);
            }
            medico.img = nombreArchivo;
            medico.save( (err, medicoActualizado) =>{
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al guardar archivo',
                        errors: err
                    });
                }

                if(!medicoActualizado){
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'No existe el id: ' + id,
                    });
                }

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de medico actualizada',
                    usuario: medicoActualizado
                });
            });
        });
    }
}

module.exports = app;