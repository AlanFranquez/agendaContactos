import React,{useEffect, useState} from 'react';
import axios from 'axios';

function App() {
  const [data, setdata] = useState([]);
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    telefono: ''
    
  });

  const [alerta, setAlerta] = useState(false);

  const [editar, setEditar] = useState(null);

  const fetchData = async() => {
    try {
      const response = await axios.get('http://localhost:3000/');
      setdata(response.data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async(id) => {
    try {
      const response = await axios.delete('http://localhost:3000/'+id);
      fetchData();
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(!formData.nombre || !formData.correo || !formData.telefono) {
      setAlerta(true);
      setTimeout(() => {
        setAlerta(false);
      }, 2000);
      return;
    }
  
    try {
      if (editar) {
        // Si está en modo edición, envía la solicitud de actualización
        await axios.delete('http://localhost:3000/' + editar);
        setEditar(null);
      }
      
      const response = await axios.post('http://localhost:3000/', formData);
  
  
      // Limpia el formulario y vuelve a cargar los datos
      setFormData({
        nombre: '',
        telefono: '',
        correo: ''
      });
      fetchData();
  
    } catch (error) {
      console.error('Error al procesar la solicitud:', error);
    }
  };
  

  const handleInputChange = (e) => {
    const {name, value} = e.target;

    setFormData({
      ...formData,
      [name]: value
    });
  }

  const handleEdit = async(id, nombre, telefono, correo) => {
    setEditar(id);
    setFormData({
      nombre,
      telefono,
      correo
    });
  }


  return (
    <>
      <h1>Agenda de Contactos</h1>
      <p className='sub'>Aplicacion FullStack creada usando NodeJs/Express, React y PostgresSQL</p>
      <hr></hr>

      <form onSubmit={handleSubmit}>
        <input type="text" name='nombre' placeholder='Nombre' value={formData.nombre} onChange={handleInputChange}/>
        <input type="text" name='telefono' placeholder='Teléfono' value={formData.telefono} onChange={handleInputChange}/>
        <input type="text" name='correo' placeholder='Correo Electronico' value={formData.correo} onChange={handleInputChange}/>

        {alerta ? <p>Por favor, rellena todos los campos</p> : ''}
        <button type='submit'>{editar ? 'Editar':'Agregar'}</button>

      </form>

        {data.map((d) => {
          return (
            <div className={`resultados ${editar === d.id ? 'eliminar-animacion' : ''}`} key={d.id}>
              <p> 👩‍💻 {d.nombre} | 📠 {d.correo} | 📱 {d.telefono} </p>


              <div className='botones'>
                
                <button className='editar' onClick={() => handleEdit(d.id, d.nombre, d.telefono, d.correo)}>Editar</button>
                <button className='eliminar' onClick={() => handleDelete(d.id)}>Eliminar</ button>
              </div>
              

            </div>

          )
        })}

      

    </>
  )
}

export default App