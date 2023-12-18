var express = require('express');
const pool = require('../src/db');
var router = express.Router();

// Traer usuarios
router.get('/', function(req, res, next) {
  pool.query('SELECT * FROM contacto', (err, results) => {
    if(err) throw err;

    res.status(201).send(results.rows);
  })
});


// Agregar usuario

router.post('/', (req, res, next) => {
  const {nombre, telefono, correo} = req.body;

  pool.query('SELECT * FROM contacto WHERE nombre=$1', [nombre], (err, results) => {
    if(err) throw err;

    if(results.rows.length) {
      res.status(500).send('Ya existe este usuario');
    } else {
      pool.query('INSERT INTO contacto(nombre, telefono, correo) VALUES($1,$2,$3)', [nombre, telefono, correo], (err, results) => {
        if(err) throw err;


        res.status(201).send(results.rows);
      })
    }
  })
});


// Eliminar usuarios
router.delete('/:id', (req, res, next) => {
  const id = parseInt(req.params.id);

  pool.query('SELECT * FROM contacto WHERE id=$1', [id], (err, results) => {
    if(err) throw err;

    if(!results.rows.length) {
      res.status(404).send('Este usuario no se encuentra');
    } else {
      pool.query('DELETE FROM contacto WHERE id=$1', [id], (err, results) => {
        if(err) throw err;

        res.status(201).send('Usuario eliminado correctamente');
      })
    }
  })
});

// Editar usuarios
router.put('/:id', (req, res, next) => {
  const {id, nombre, telefono, correo} = req.body;

  pool.query('SELECT * FROM contacto WHERE id=$1', [id], (err, results) => {
    if(err) throw err;

    if(!results.rows.length) {
      res.status(404).send('El usuario no se encuentra');
    } else {
      // Agrega la consulta para actualizar los datos del usuario en la base de datos
      pool.query('UPDATE contacto SET nombre=$1, telefono=$2, correo=$3 WHERE id=$4', [nombre, telefono, correo, id], (err, results) => {
        if(err) throw err;

        res.status(201).send('Usuario actualizado correctamente');
      });
    }
  });
});



module.exports = router;
 