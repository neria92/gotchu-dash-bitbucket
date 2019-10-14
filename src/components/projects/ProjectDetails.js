import React, { Component } from 'react'
import { connect } from 'react-redux'
import { firestoreConnect } from 'react-redux-firebase'
import { compose } from 'redux'
import { Redirect } from 'react-router-dom'
import {editProject} from '../../store/actions/projectActions'
import {addProject} from '../../store/actions/projectActions'
import {deleteProject} from '../../store/actions/projectActions'
import { debug } from 'util'


class ProjectDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      complexity: { es: '' },
      description: { es: '' },
      durationSecs: 0,
      fixed: true,
      language: '',
      locationName: { es: '' },
      locationPoints: { es: '' },
      missionType: { es: '' },
      objetive: { es: '' },
      reward: { GP: 0 },
      startDate: 0,
      title: { es: '' },
      type: ''
    };
  }

  handleChange = (e) => {
    this.setState({
      [e.target.id]: e.target.value
    })
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const missionID = this.props.id;
    
    // this.setState({
    //   antecedentes: this.props.antecedentes,
    //   complejidad: this.props.complejidad,
    //   mision: this.props.mision,
    //   radio: this.props.radio,
    //   recompensa: this.props.recompensa,
    //   request: this.props.request,
    //   startDate: {seconds: this.props.startDate},
    //   timer: this.props.timer,
    //   tipo: this.props.tipo,
    //   title: this.props.title,
    //   ubicacion: {latitude: this.props.ubicacionLatitude, longitude: this.props.ubicacionLongitude },
    //   ubicacionNombre: this.props.ubicacionNombre,
    // })
    const st = this.state;
    if(missionID == 'new'){
      console.log(st);
      this.props.createProject(st);
    } else {
      this.props.editProject({ missionID, st });
    }
  }

  handleDelete = (e) => {
    e.preventDefault();
    const missionID = this.props.id;
    this.props.deleteProject(missionID);
  }
  
  render() {
    const { project, auth } = this.props;
    if (!auth.uid) return <Redirect to='/singin' /> 
    if (project) {
      return (
        <div className="container section project-details">
          <button onClick={this.handleDelete}>
          Delete
          </button>
          <div className="card z-depth-0">
            <div className="card-content">
              <form onSubmit={this.handleSubmit}>
                <label>
                  Titulo:
                <input defaultValue={project.title.es} id="titleES" onChange={this.handleChange} />
                </label>
                <label>
                  Complejidad:
                <input defaultValue={project.complexity.es} id="complexityES" onChange={this.handleChange} />
                </label>
                <label>
                  Descripcion:
                <textarea defaultValue={project.description.es} id="descriptionES" onChange={this.handleChange} />
                </label>
                <label>
                  Duracion segundos:
                <input type="number" defaultValue={project.durationSecs} id="durationSecs" onChange={this.handleChange} />
                </label>
                <label>
                  Fixed:
                <input defaultValue={project.fixed} id="Fixed" onChange={this.handleChange} />
                </label>
                <label>
                  Idioma:
                <input defaultValue={project.language} id="language" onChange={this.handleChange} />
                </label>
                <label>
                  Locacion nombre:
                <input defaultValue={project.locationName.es} id="locationNameES" onChange={this.handleChange} />
                </label>
                <label>
                  Locacion puntos:
                <input defaultValue={project.locationPoints.es} id="locationPointsES" onChange={this.handleChange} />
                </label>
                <label>
                  Tipo de mision:
                <input defaultValue={project.missionType.es} id="missionTypeES" onChange={this.handleChange} />
                </label>
                <label>
                  Objetivo:
                <textarea value={project.objective.es} id="objetiveES" onChange={this.handleChange} />
                </label>
                <label>
                  Recompensa:
                <input type="number" defaultValue={project.reward.GP} id="rewardGP" onChange={this.handleChange} />
                </label>
                <label>
                  Fecha inicio:
                <input type="number" defaultValue={project.startDate} id="startDate" onChange={this.handleChange} />
                </label>
                <label>
                  Tipo:
                <input defaultValue={project.type} id="type" onChange={this.handleChange} />
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
  var project;
  if(id == 'new'){
    project = {
      complexity: { es: '' },
      description: { es: '' },
      durationSecs: 0,
      fixed: true,
      language: '',
      locationName: { es: '' },
      locationPoints: { es: '' },
      missionType: { es: '' },
      objetive: { es: '' },
      reward: { GP: 0 },
      startDate: 0,
      title: { es: '' },
      type: ''
    }
  } else {
    const captures = state.firestore.data.missions;
    project = captures ? captures[id] : null;
  }
  
  return {
    id: id,
    project: project,
    auth: state.firebase.auth
  }
}

const mapDispathToProps = (dispatch) => {
  return {
    editProject: (capture) => dispatch(editProject(capture)),
    createProject: (capture) => dispatch(addProject(capture)),
    deleteProject: (capture) => dispatch(deleteProject(capture))
  }
}

export default compose(
  connect(mapStateToProps, mapDispathToProps),
  firestoreConnect([{
    collection: 'missions'
  }])
)(ProjectDetails)