import React, { useState } from 'react';
import './Formulario.css';

const Formulario = ({ onSuccess }) => {

    

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
      const response = await fetch('http://localhost:3000/insertar-datos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      if (response.ok) {
        console.log('Datos insertados correctamente');
        onSuccess();
        window.location.href = '/pagina1';
        ; // Redirige usando la prop history

        // Puedes hacer alguna acción adicional aquí si es necesario
      } else {
        console.error('Error al insertar datos:', response.statusText);
        // Puedes manejar el error de alguna manera si es necesario
      }
    } catch (error) {
      console.error('Error de red:', error);
      // Puedes manejar el error de red de alguna manera si es necesario
    }
  };
  //console.log(formData);
  

  return (
    <div className="container mt-5">
      <h2>Formulario Nuevo Registro</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="nombres">Nombres</label>
          <input type="text" className="form-control" id="nombres" placeholder="Ingresa tus nombres" name="nombres" value={formData.nombres} onChange={handleInputChange} />
        </div>

        <div className="form-group">
          <label htmlFor="cedula">Cédula</label>
          <input type="text" className="form-control" id="cedula" placeholder="Ingresa tu cédula" name="cedula" value={formData.cedula} onChange={handleInputChange} />
        </div>

        <div className="form-group">
          <label htmlFor="celular">Celular</label>
          <input type="text" className="form-control" id="celular" placeholder="Ingresa tu número de celular" name="celular" value={formData.celular} onChange={handleInputChange} />
        </div>

        <div className="form-group">
          <label htmlFor="direccion">Dirección</label>
          <input type="text" className="form-control" id="direccion" placeholder="Ingresa tu dirección" name="direccion" value={formData.direccion} onChange={handleInputChange} />
        </div>

        <div className="form-group">
          <label htmlFor="ciudad">Ciudad</label>
          <input type="text" className="form-control" id="ciudad" placeholder="Ingresa tu ciudad" name="ciudad" value={formData.ciudad} onChange={handleInputChange} />
        </div>

        <div className="form-group">
          <label htmlFor="departamento">Departamento</label>
          <input type="text" className="form-control" id="departamento" placeholder="Ingresa tu departamento" name="departamento" value={formData.departamento} onChange={handleInputChange} />
        </div>

        <div className="form-group">
          <label htmlFor="nroAgente">Nro Agente</label>
          <input type="text" className="form-control" id="nroAgente" placeholder="Ingresa tu número de agente" name="nroAgente" value={formData.nroAgente} onChange={handleInputChange} />
        </div>

        <div className="form-group">
          <label htmlFor="nombreAgente">Nombre del Agente</label>
          <input type="text" className="form-control" id="nombreAgente" placeholder="Ingresa el nombre del agente" name="nombreAgente" value={formData.nombreAgente} onChange={handleInputChange} />
        </div>

        <button type="submit" className="btn btn-primary">Enviar</button>
      </form>
    </div>
  );
};

export default Formulario;
