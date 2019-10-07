import React, { Component } from 'react'
import { connect } from 'react-redux'
import { firestoreConnect } from 'react-redux-firebase'
import { compose } from 'redux'
import { Redirect } from 'react-router-dom'
import {editProject} from '../../store/actions/projectActions'
import { debug } from 'util'


class UserDetails extends Component {

  state = {
    antecedentes: null,
    complejidad: null,
    missionID: null,
    mision: null,
    radio: 0,
    recompensa: 0,
    request: null,
    startDate: null,
    timer: 0,
    title: null,
    ubicacion: null,
    ubicacionNombre: null,
  }

  handleChange = (e) => {
    this.setState({
      [e.target.id]: e.target.value
    })
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const missionID = this.props.id;
    this.setState({
      antecedentes: this.props.antecedentes,
      complejidad: this.props.complejidad,
      mision: this.props.mision,
      radio: this.props.radio,
      recompensa: this.props.recompensa,
      tipo: this.props.tipo,
      title: this.props.title,
      ubicacionNombre: this.props.ubicacionNombre,
    })
    const st = this.state;
    this.props.editProject({ missionID, st });
  }
  
  render() {
    const { project, auth } = this.props;
    if (!auth.uid) return <Redirect to='/singin' /> 
    if (project) {
      return (
        <div className="container section project-details">
          <div className="card z-depth-0">
            <div className="card-content">
              <form onSubmit={this.handleSubmit}>
                <label>
                  Antecedentes:
                <textarea defaultValue={project.antecedentes} id="antecedentes" onChange={this.handleChange} />
                </label>
                <label>
                  Complejidad:
                <input defaultValue={project.complejidad} id="complejidad" onChange={this.handleChange} />
                </label>
                <label>
                  Mision:
                <textarea defaultValue={project.mision} id="mision" onChange={this.handleChange} />
                </label>
                <label>
                  Radio:
                <input type="number" defaultValue={project.radio} id="radio" onChange={this.handleChange} />
                </label>
                <label>
                  Recompensa:
                <input type="number" defaultValue={project.recompensa} id="recompensa" onChange={this.handleChange} />
                </label>
                <label>
                  Request:
                <input defaultValue={project.request} id="request" onChange={this.handleChange} />
                </label>
                <label>
                  Fecha de inicio:
                <input type="number" defaultValue={project.startDate.seconds} id="startdate" onChange={this.handleChange} />
                </label>
                <label>
                  Timer:
                <input type="number" defaultValue={project.timer} id="timer" onChange={this.handleChange} />
                </label>
                <label>
                  Tipo:
                <input value={project.tipo} id="tipo" onChange={this.handleChange} />
                </label>
                <label>
                  Titulo:
                <input defaultValue={project.title} id="title" onChange={this.handleChange} />
                </label>
                <label>
                  Ubicacion latitude:
                <input type="number" defaultValue={project.ubicacion.latitude} id="ubicacionlatitude" onChange={this.handleChange} />
                </label>
                <label>
                  Ubicacion longitud:
                <input type="number" defaultValue={project.ubicacion.longitude} id="ubicacionlongitude" onChange={this.handleChange} />
                </label>
                <label>
                  Nombre de ubicacion:
                <textarea defaultValue={project.ubicacionNombre} id="ubicacionNombre" onChange={this.handleChange} />
                </label>
                <input type="submit" value="Guardar" />
              </form>

              {/* <form onSubmit={this.handleSubmit} className="white">
              <span className="card-title">{project.title}</span>
                <input type="textArea" defaultValue={project.antecedentes} id="antecedentes" onChange={this.handleChange} />
              <button className="btn black lighten-1 z-depth-0">Submit Capture</button>
              </form> */}
            </div>
            <div className="card-action grey lighten-4 grey-text">
              <div>Mission by {project.creator}</div>
            </div>
          </div>
        </div>
      )
    } else {
      return (
        <div className="container center">
          <p>Loading project...</p>
        </div>
      )
    }
  }
}

const mapStateToProps = (state, ownProps) => {
  const id = ownProps.match.params.id;
  const captures = state.firestore.data.missions;
  const project = captures ? captures[id] : null;
  console.log(project);
  
  return {
    id: id,
    project: project,
    auth: state.firebase.auth
  }
}

const mapDispathToProps = (dispatch) => {
  return {
    editProject: (capture) => dispatch(editProject(capture))
  }
}

export default compose(
  connect(mapStateToProps, mapDispathToProps),
  firestoreConnect([{
    collection: 'missions'
  }])
)(UserDetails)