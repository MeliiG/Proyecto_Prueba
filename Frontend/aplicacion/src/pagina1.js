import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import './pagina1.css';

const ClienteTabla = ({nombreUsuario}) => {
  const [clientes, setClientes] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Función para obtener la lista de clientes desde el backend
    const obtenerClientes = async () => {
      try {
        const response = await fetch('http://localhost:3000/clientes');
        if (response.ok) {
          const data = await response.json();
          setClientes(data);
        } else {
          setError('Error al obtener datos de clientes');
        }
      } catch (error) {
        setError('Error al obtener datos de clientes: ' + error.message);
      }
    };

    // Llama a la función para obtener los clientes cuando el componente se monta
    obtenerClientes();
    
  }, []);

  const handleEliminarCliente = async (clienteId) => {
    try {
      const clienteIndex = clientes.findIndex(cliente => cliente.id === clienteId);
      if (clienteIndex === -1) {
        throw new Error('Cliente no encontrado en el estado local');
      }

      const response = await fetch(`http://localhost:3000/clientes/${clienteId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error al eliminar el cliente: ' + response.statusText);
      }

      // Elimina el cliente del array de clientes localmente
      const updatedClientes = [...clientes];
      updatedClientes.splice(clienteIndex, 1);
      setClientes(updatedClientes);
    } catch (error) {
      setError(error.message);
    }
  };
  

  return (
    <div>
      
      <h1 className="table-title">Tabla de Clientes</h1>
      <Link to="/Formulario">
        <button className="btn-create">Crear Registro</button>
      </Link>
      {error ? (<p>{error}</p>) : (
        <table className="clientes-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Cedula</th>
              <th>Celular</th>
              <th>Direccion</th>
              <th>ciudad</th>
              <th>Nro-Agente</th>
              <th>opciones</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map(cliente => (
              <tr key={cliente.id}>
                <td>{cliente.id}</td>
                <td>{cliente.nombres}</td>
                <td>{cliente.cedula}</td>
                <td>{cliente.celular}</td>
                <td>{cliente.direccion}</td>
                <td>{cliente.ciudad_id}</td>
                <td>{cliente.cedula_agente}</td>
                <td>
                  <Link to={`/editar/${cliente.id}`}>
                    <FaEdit className="mr-2" />
                  </Link>
                  <FaTrashAlt onClick={() => handleEliminarCliente(cliente.id)} className="cursor-pointer trash-icon" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ClienteTabla;
