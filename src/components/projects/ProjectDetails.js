import React, { Component } from 'react'
import { connect } from 'react-redux'
import { firestoreConnect } from 'react-redux-firebase'
import { compose } from 'redux'
import { Redirect } from 'react-router-dom'
import { editProject, addProject, deleteProject} from '../../store/actions/projectActions'

class ProjectDetails extends Component {

  state = {
    // complexityES: this.props.project.complexity.es,
    // descriptionES: this.props.project.description.es,
    // durationSecs: this.props.project.durationSecs,
    // fixed: this.props.project.fixed,
    // language: this.props.project.language,
    // locationNameES: this.props.project.locationName.es,
    // locationPointsES: this.props.project.locationPoints.es,
    // missionTypeES: this.props.project.missionType.es,
    // objetiveES: this.props.project.objetive.es,
    // rewardGP: this.props.project.reward.GP,
    // startDate: this.props.project.startDate,
    // titleES: this.props.project.title.es,
    // type: this.props.project.type,
    savingChanges: false,
    projectLoaded: true
  };

  // state = {
  //   complexityES: '',
  //   descriptionES: '',
  //   durationSecs: 0,
  //   fixed: true,
  //   language: '',
  //   locationNameES: '',
  //   locationPointsES: '',
  //   missionTypeES: '',
  //   objetiveES: '',
  //   rewardGP: 0,
  //   startDate: 0,
  //   titleES: '',
  //   type: '',
  //   savingChanges: false,
  //   projectLoaded: false
  // };

  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     complexityES: this.props.project.complexity.es,
  //     descriptionES: this.props.project.description.es,
  //     durationSecs: this.props.project.durationSecs,
  //     fixed: this.props.project.fixed,
  //     language: this.props.project.language,
  //     locationNameES: this.props.project.locationName.es,
  //     locationPointsES: this.props.project.locationPoints.es,
  //     missionTypeES: this.props.project.missionType.es,
  //     objetiveES: this.props.project.objetive.es,
  //     rewardGP: this.props.project.reward.GP,
  //     startDate: this.props.project.startDate,
  //     titleES: this.props.project.title.es,
  //     type: this.props.project.type,
  //     savingChanges: false,
  //     projectLoaded: true
  //   };
  //   // const { project } = this.props;
  //   // console.log(project);
  //   // if (project && !this.state.projectLoaded) {
  //   //   this.state = {
  //   //     complexityES: project.complexity.es,
  //   //     descriptionES: project.description.es,
  //   //     durationSecs: project.durationSecs,
  //   //     fixed: project.fixed,
  //   //     language: project.language,
  //   //     locationNameES: project.locationName.es,
  //   //     locationPointsES: project.locationPoints.es,
  //   //     missionTypeES: project.missionType.es,
  //   //     objetiveES: project.objetive.es,
  //   //     rewardGP: project.reward.GP,
  //   //     startDate: project.startDate,
  //   //     titleES: project.title.es,
  //   //     type: project.type,
  //   //     savingChanges: false,
  //   //     projectLoaded: true
  //   //   };
  //   // }

  // }

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
      durationSecs: this.refs.durationSecs.value,
      fixed: this.refs.fixed.value,
      language: this.refs.language.value,
      locationNameES: this.refs.locationNameES.value,
      locationPointsES: this.refs.locationPointsES.value,
      missionTypeES: this.refs.missionTypeES.value,
      objetiveES: this.refs.objetiveES.value,
      rewardGP: this.refs.rewardGP.value,
      startDate: this.refs.startDate.value,
      titleES: this.refs.titleES.value,
      type: this.refs.type.value,
    };
    this.setState({
      ...this.state,
      savingChanges: true
    })
    if(missionID == 'new'){
      //console.log(st);
      //this.props.createProject(st);
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
    const { project, auth, projectActions } = this.props;
    console.log(projectActions);
    if (this.state.savingChanges && projectActions.projectSaved){
      return <Redirect to='/' /> 
    }

    if (!auth.uid) return <Redirect to='/singin' /> 
    if (project) {
      const lang = project.language;

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
                  Fixed:
                <input defaultValue={project.fixed} ref="fixed" onChange={this.handleChange} />
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
                  Locacion puntos:
                <input defaultValue={project.locationPoints[lang]} ref="locationPointsES" onChange={this.handleChange} />
                </label>
                <label>
                  Tipo de mision:
                <input defaultValue={project.missionType[lang]} ref="missionTypeES" onChange={this.handleChange} />
                </label>
                <label>
                  Objetivo:
                <textarea value={project.objective[lang]} ref="objetiveES" onChange={this.handleChange} />
                </label>
                <label>
                  Recompensa:
                <input type="number" defaultValue={project.reward.GP} ref="rewardGP" onChange={this.handleChange} />
                </label>
                <label>
                  Fecha inicio:
                <input type="number" defaultValue={project.startDate} ref="startDate" onChange={this.handleChange} />
                </label>
                <label>
                  Tipo:
                <input defaultValue={project.type} ref="type" onChange={this.handleChange} />
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
    auth: state.firebase.auth,
    projectActions: state.projectReducer
  }
}

const mapDispathToProps = (dispatch) => {
  return {
    editProject: (capture) => dispatch(editProject(capture)),
    createProject: (capture) => dispatch(addProject(capture)),
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