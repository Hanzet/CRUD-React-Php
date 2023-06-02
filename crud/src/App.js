/* npm i bootstrap reactstrap axios: Boostrap para mejorar los estilos CCS, Reacstrap para las ventanas modales
y Axios para hacer las peticines a la Api */

import React, {useState, useEffect} from 'react'; // Nos permite rastrear el estado en un componente de función
import 'bootstrap/dist/css/bootstrap.min.css';
import {Modal, ModalBody, ModalFooter, ModalHeader} from 'reactstrap';
import axios from 'axios';

function App() {
  const baseUrl="http://localhost/database/";
  const [data, setData]=useState([]);
  const [CampoInsertar, setCampoInsertar]= useState(false);
  const [campoEditar, setcampoEditar]= useState(false);
  const [campoEliminar, setModalEliminar]= useState(false);
  const [DatoSeleccionado, setDatoSeleccionado]=useState({
    id: '',
    nombre: '',
    apellido: '',
    materia: '',
    codigo: 0,
    facultad: '',
    semestre: 0
  });

  const handleChange=e=>{
    const {name, value}=e.target;
    setDatoSeleccionado((prevState)=>({
      ...prevState,
      [name]: value
    }))
    console.log(DatoSeleccionado);
  }

  const abrirCerrarCampoInsertar=()=>{
    setCampoInsertar(!CampoInsertar);
  }

  const abrirCerrarcampoEditar=()=>{
    setcampoEditar(!campoEditar);
  }

  const abrirCerrarModalEliminar=()=>{
    setModalEliminar(!campoEliminar);
  }

  const peticionGet=async()=>{ // Recupera los datos que el cliente inserta
    await axios.get(baseUrl)
    .then(response=>{
      setData(response.data);
    }).catch(error=>{
      console.log(error);
    })
  }

  const peticionPost=async()=>{ //>Manda la información en este caso  en un FormData
    var f = new FormData();
    console.log(DatoSeleccionado);
    f.append("nombre", DatoSeleccionado.nombre);
    f.append("apellido", DatoSeleccionado.apellido);
    f.append("materia", DatoSeleccionado.materia);
    f.append("codigo", DatoSeleccionado.codigo);
    f.append("facultad", DatoSeleccionado.facultad);
    f.append("semestre", DatoSeleccionado.semestre);
    f.append("METHOD", "POST"); // Tipo de solicitud que se esta realizando
    await axios.post(baseUrl, f)
    .then(response=>{
      setData(data.concat(response.data)); // Concatena la solicitud en modo data
      abrirCerrarCampoInsertar();
    }).catch(error=>{
      console.log(error);
    })
  }

  const peticionPut=async()=>{
    var f = new FormData();
    f.append("nombre", DatoSeleccionado.nombre);
    f.append("apellido", DatoSeleccionado.apellido);
    f.append("materia", DatoSeleccionado.materia);
    f.append("codigo", DatoSeleccionado.codigo);
    f.append("facultad", DatoSeleccionado.facultad);
    f.append("semestre", DatoSeleccionado.semestre);
    f.append("METHOD", "PUT");
    await axios.post(baseUrl, f, {params: {id: DatoSeleccionado.id}})
    .then(response=>{
      var dataNueva= data;
      dataNueva.map(Dato=>{
        if(peticionPost.id===DatoSeleccionado.id){
          peticionPost.nombre=DatoSeleccionado.nombre;
          peticionPost.apellido=DatoSeleccionado.apellido;
          peticionPost.materia=DatoSeleccionado.materia;
          peticionPost.codigo=DatoSeleccionado.codigo;
          peticionPost.facultad=DatoSeleccionado.facultad;
          peticionPost.semestre=DatoSeleccionado.semestre;
        }
      });
      refreshPage();
      setData(dataNueva);
      abrirCerrarcampoEditar();
    }).catch(error=>{
      console.log(error);
    })
  }

  function refreshPage() {
    window.location.reload(false);
  }

  const peticionDelete=async()=>{
    var f = new FormData();
    f.append("METHOD", "DELETE");
    await axios.post(baseUrl, f, {params: {id: DatoSeleccionado.id}})
    .then(response=>{
      setData(data.filter(Dato=>Dato.id!==DatoSeleccionado.id));
      abrirCerrarModalEliminar();
    }).catch(error=>{
      console.log(error);
    })
  }

  const seleccionarDato=(Dato, caso)=>{
    setDatoSeleccionado(Dato);

    (caso==="Editar")?
    abrirCerrarcampoEditar():
    abrirCerrarModalEliminar()
  }

  useEffect(()=>{
    peticionGet();
  },[])

  return (
    <div style={{textAlign: 'center'}}>
<br />
      <h4>Bienvenido al sistema de "Create-Read-Update-Delete"</h4>
      <button className="btn btn-success" onClick={()=>abrirCerrarCampoInsertar()}>Agregar</button>
      <br /><br />
    <table className="table table-striped">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Apellido</th>
          <th>Materia</th>
          <th>Código</th>
          <th>Facultad</th>
          <th>Semestre</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {data.map(Dato=>( //Mapea completamente los datos que se encuentran guardados en la BD
          <tr key={Dato.id}>
            <td>{Dato.id}</td>
            <td>{Dato.nombre}</td>
            <td>{Dato.apellido}</td>
            <td>{Dato.materia}</td>
            <td>{Dato.codigo}</td>
            <td>{Dato.facultad}</td>
            <td>{Dato.semestre}</td>
          <td>
          <button className="btn btn-primary" onClick={()=>seleccionarDato(Dato, "Editar")}>Editar</button> {"  "}
          <button className="btn btn-danger" onClick={()=>seleccionarDato(Dato, "Eliminar")}>Eliminar</button>
          </td>
          </tr>
        ))}


      </tbody> 

    </table>
    <Modal isOpen={CampoInsertar}>
      <ModalHeader>Insertar Campo</ModalHeader>
      <ModalBody>
        <div className="form-group">
          <label>Nombre: </label>
          <br />
          <input type="text" className="form-control" name="nombre" onChange={handleChange}value={DatoSeleccionado && DatoSeleccionado.nombre} /> 
          <br />
          <label>Apellido: </label>
          <br />
          <input type="text" className="form-control" name="apellido" onChange={handleChange} value={DatoSeleccionado && DatoSeleccionado.apellido} />
          <br />
          <label>Materia: </label>
          <br />
          <input type="text" className="form-control" name="materia" onChange={handleChange} value={DatoSeleccionado && DatoSeleccionado.materia}/>
          <br />
          <label>Codigo: </label>
          <br />
          <input type="text" className="form-control" name="codigo" onChange={handleChange} value={DatoSeleccionado && DatoSeleccionado.codigo}/>
          <br />
          <label>Facultad: </label>
          <br />
          <input type="text" className="form-control" name="facultad" onChange={handleChange} value={DatoSeleccionado && DatoSeleccionado.facultad}/>
          <br />
          <label>Semestre: </label>
          <br />
          <input type="text" className="form-control" name="semestre" onChange={handleChange} value={DatoSeleccionado && DatoSeleccionado.semestre}/>
          <br />
        </div>
      </ModalBody>
      <ModalFooter>
        <button className="btn btn-primary" onClick={()=>peticionPost()}>Insertar</button>{"   "}
        <button className="btn btn-danger" onClick={()=>abrirCerrarCampoInsertar()}>Cancelar</button>
      </ModalFooter>
    </Modal>

    <Modal isOpen={campoEditar}>
      <ModalHeader>Editar Campo</ModalHeader>
      <ModalBody>
        <div className="form-group">
          <label>Nombre: </label>
          <br />
          <input type="text" className="form-control" name="nombre" onChange={handleChange} value={DatoSeleccionado && DatoSeleccionado.nombre}/>
          <br />
          <label>Apellido: </label>
          <br />
          <input type="text" className="form-control" name="apellido" onChange={handleChange} value={DatoSeleccionado && DatoSeleccionado.apellido}/>
          <br />
          <label>Materia: </label>
          <br />
          <input type="text" className="form-control" name="materia" onChange={handleChange} value={DatoSeleccionado && DatoSeleccionado.materia}/>
          <br />
          <label>Código: </label>
          <br />
          <input type="text" className="form-control" name="codigo" onChange={handleChange} value={DatoSeleccionado && DatoSeleccionado.codigo}/>
          <br />
          <label>Facultad: </label>
          <br />
          <input type="text" className="form-control" name="facultad" onChange={handleChange} value={DatoSeleccionado && DatoSeleccionado.facultad}/>
          <br />
          <label>Semestre: </label>
          <br />
          <input type="text" className="form-control" name="semestre" onChange={handleChange} value={DatoSeleccionado && DatoSeleccionado.semestre}/>
          <br />
        </div>
      </ModalBody>
      <ModalFooter>
        <button className="btn btn-primary" onClick={()=>peticionPut()}>Editar</button>{"   "}
        <button className="btn btn-danger" onClick={()=>abrirCerrarcampoEditar()}>Cancelar</button>
      </ModalFooter>
    </Modal>

    <Modal isOpen={campoEliminar}>
        <ModalBody>
        ¿¡Hey! Espera, estás seguro que deseas eliminar el campo con el nombre: {DatoSeleccionado && DatoSeleccionado.nombre}?
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-danger" onClick={()=>peticionDelete()}>
            Sí
          </button>
          <button
            className="btn btn-secondary"
            onClick={()=>abrirCerrarModalEliminar()}
          >
            No
          </button>
        </ModalFooter>
      </Modal>

    </div>
  );
}
export default App;