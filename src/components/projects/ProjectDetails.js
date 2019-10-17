import React, { Component } from 'react'
import { connect } from 'react-redux'
import { firestoreConnect } from 'react-redux-firebase'
import { compose } from 'redux'
import { Redirect } from 'react-router-dom'
import { editProject, addProject, deleteProject} from '../../store/actions/projectActions'

class ProjectDetails extends Component {

  state = {
    savingChanges: false,
    projectLoaded: true,
    deletingProject: false
  };


  handleChange = (e) => {
    this.setState({
      [e.target.id]: e.target.value
    })
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const missionID = this.props.id;

    const st = {
      complexityES: this.refs.complexityES.value,
      descriptionES: this.refs.descriptionES.value,
      durationSecs: parseInt(this.refs.durationSecs.value),
      evidenceType: parseInt(this.refs.evidenceType.value),
      image0: this.refs.image0.value,
      image1: this.refs.image1.value,
      image2: this.refs.image2.value,
      language: this.refs.language.value,
      locationNameES: this.refs.locationNameES.value,
      locationPoint0Lat: this.refs.locationPoint0Lat.value,
      locationPoint0Long: this.refs.locationPoint0Long.value,
      locationPoint0Radius: this.refs.locationPoint0Radius.value,
      missionTypeES: this.refs.missionTypeES.value,
      objetiveES: this.refs.objetiveES.value,
      rewardGP: parseInt(this.refs.rewardGP.value),
      startDate: parseInt(this.refs.startDate.value),
      titleES: this.refs.titleES.value,
      type: this.refs.type.value,
    };
    this.setState({
      ...this.state,
      savingChanges: true
    })
    if(missionID == 'new'){
      console.log(st);
      this.props.addProject(st);
    } else {
      console.log(st);
      this.props.editProject({ missionID, st });
    }
  }

  handleDelete = (e) => {
    e.preventDefault();
    const missionID = this.props.id;
    this.setState({
      ...this.state,
      deletingProject: true
    })
    this.props.deleteProject(missionID);
  }
  
  render() {
    const { project, auth, projectActions } = this.props;
    if (this.state.savingChanges && projectActions.projectSaved){
      return <Redirect to='/' /> 
    }
    if (this.state.deletingProject && projectActions.projectDeleted) {
      return <Redirect to='/' />
    }

    if (!auth.uid) return <Redirect to='/singin' /> 
    if (project) {
      const lang = project.language;

      return (
        <div className="container section project-details">
          <button className="btn waves-effect waves-light" onClick={this.handleDelete}>Eliminar</button>
          <div className="card z-depth-0">
            <div className="card-content">
              <form onSubmit={this.handleSubmit} style={{ marginTop: "0px auto" }}>
                <label>
                  Titulo:
                <input defaultValue={project.title[lang]} ref="titleES" onChange={this.handleChange} />
                </label>
                <label>
                  Complejidad:
                <input defaultValue={project.complexity[lang]} ref="complexityES" onChange={this.handleChange} />
                </label>
                <label>
                  Descripcion:
                <textarea defaultValue={project.description[lang]} ref="descriptionES" onChange={this.handleChange} />
                </label>
                <label>
                  Duracion segundos:
                <input type="number" defaultValue={project.durationSecs} ref="durationSecs" onChange={this.handleChange} />
                </label>
                <label>
                  Tipo de evidencia:
                <input type="number" defaultValue={project.evidenceType} ref="evidenceType" onChange={this.handleChange} />
                </label>
                <label>
                  Imagen 0:
                <input defaultValue={project.images[0]} ref="image0" onChange={this.handleChange} />
                </label>
                <label>
                  Imagen 1:
                <input defaultValue={project.images[1]} ref="image1" onChange={this.handleChange} />
                </label>
                <label>
                  Imagen 2:
                <input defaultValue={project.images[2]} ref="image2" onChange={this.handleChange} />
                </label>
                <label>
                  Idioma:
                <input defaultValue={project.language} ref="language" onChange={this.handleChange} />
                </label>
                <label>
                  Locacion nombre:
                <input defaultValue={project.locationName[lang]} ref="locationNameES" onChange={this.handleChange} />
                </label>
                <label>
                  Locacion puntos 0 latitud:
                <input defaultValue={project.locationPoints[0].coord.lat} ref="locationPoint0Lat" onChange={this.handleChange} />
                </label>
                <label>
                  Locacion puntos 0 longitud:
                <input defaultValue={project.locationPoints[0].coord.long} ref="locationPoint0Long" onChange={this.handleChange} />
                </label>
                <label>
                  Locacion puntos 0 radio:
                <input defaultValue={project.locationPoints[0].radius} ref="locationPoint0Radius" onChange={this.handleChange} />
                </label>
                <label>
                  Tipo de mision:
                <input defaultValue={project.missionType[lang]} ref="missionTypeES" onChange={this.handleChange} />
                </label>
                <label>
                  Objetivo:
                <textarea defaultValue={project.objective[lang]} ref="objetiveES" onChange={this.handleChange} />
                </label>
                <label>
                  Recompensa:
                <input type="number" defaultValue={project.reward.QP} ref="rewardGP" onChange={this.handleChange} />
                </label>
                <label>
                  Fecha inicio:
                <input type="number" defaultValue={project.startDate} ref="startDate" onChange={this.handleChange} />
                </label>
                <label>
                  Tipo:
                <input defaultValue={project.type} ref="type" onChange={this.handleChange} />
                </label>
                {/* <input type="submit" value="Guardar" /> */}
                <button className="btn waves-effect waves-light" type="submit" name="action">Guardar</button>
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
      language: 'es',
      locationName: { es: '' },
      locationPoints: { es: '' },
      missionType: { es: '' },
      objective: { es: '' },
      reward: { GP: 0 },
      startDate: 0,
      title: { es: '' },
      type: ''
    }
  } else {
    const captures = state.firestore.data.missions;
    project = captures ? captures[id] : null;
  }
  console.log(project);
  return {
    id: id,
    project: project,
    auth: state.firebase.auth,
    projectActions: state.projectReducer
  }
}

const mapDispathToProps = (dispatch) => {
  return {
    editProject: (capture) => dispatch(editProject(capture)),
    addProject: (capture) => dispatch(addProject(capture)),
    deleteProject: (capture) => dispatch(deleteProject(capture)),
    resetSavedProject: () => dispatch({ type: "Reset_Saved_Project" }),
  }
}

export default compose(
  connect(mapStateToProps, mapDispathToProps),
  firestoreConnect([{
    collection: 'missions'
  }])
)(ProjectDetails)