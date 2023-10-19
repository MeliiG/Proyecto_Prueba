import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const FormularioEdicion = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    nombres: '',
    cedula: '',
    celular: '',
    direccion: '',
    ciudad: '',
    departamento: '',
    nroAgente: '',
    nombreAgente: ''
  });

  useEffect(() => {
    // Lógica para obtener el registro con el ID proporcionado desde la API
    // Puedes utilizar fetch o Axios para obtener los datos del servidor
    // Ejemplo usando fetch:
    fetch(`http://localhost:3000/clientes/${id}`)
      .then(response => response.json())
      .then(data => {
        // Actualizar el estado con los datos del registro obtenidos
        setFormData(data);
      })
      .catch(error => console.error('Error al obtener datos del registro:', error));
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3000/clientes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        console.log('Datos actualizados correctamente');
        // Puedes redirigir a la página deseada después de la actualización
        window.location.href = '/pagina1';
      } else {
        console.error('Error al actualizar datos:', response.statusText);
        // Puedes manejar el error de alguna manera si es necesario
      }
    } catch (error) {
      console.error('Error de red:', error);
      // Puedes manejar el error de red de alguna manera si es necesario
    }
  };

  

  return (
    <div className="container mt-5">
      <h2>Editar Registro</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="nombres">Nombres</label>
          <input type="text" className="form-control" id="nombres" name="nombres" value={formData.nombres} onChange={handleInputChange} />
        </div>

        <div className="form-group">
          <label htmlFor="cedula">Cédula</label>
          <input type="text" className="form-control" id="cedula" name="cedula" value={formData.cedula} onChange={handleInputChange} />
        </div>

        <div className="form-group">
          <label htmlFor="celular">Celular</label>
          <input type="text" className="form-control" id="celular" name="celular" value={formData.celular} onChange={handleInputChange} />
        </div>

        <div className="form-group">
          <label htmlFor="direccion">Dirección</label>
          <input type="text" className="form-control" id="direccion" name="direccion" value={formData.direccion} onChange={handleInputChange} />
        </div>

        <div className="form-group">
          <label htmlFor="ciudad">Ciudad</label>
          <input type="text" className="form-control" id="ciudad" name="ciudad" value={formData.ciudad} onChange={handleInputChange} />
        </div>

        <div className="form-group">
          <label htmlFor="departamento">Departamento</label>
          <input type="text" className="form-control" id="departamento" name="departamento" value={formData.departamento} onChange={handleInputChange} />
        </div>

        <div className="form-group">
          <label htmlFor="nroAgente">Nro Agente</label>
          <input type="text" className="form-control" id="nroAgente" name="nroAgente" value={formData.nroAgente} onChange={handleInputChange} />
        </div>

        <div className="form-group">
          <label htmlFor="nombreAgente">Nombre del Agente</label>
          <input type="text" className="form-control" id="nombreAgente" name="nombreAgente" value={formData.nombreAgente} onChange={handleInputChange} />
        </div>

        <button type="submit" className="btn btn-primary">Guardar Cambios</button>
      </form>
    </div>
  );
};

export default FormularioEdicion;
