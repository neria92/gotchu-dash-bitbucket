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
      complexity: { es: this.refs.complexityES.value },
      description: { es: this.refs.descriptionES.value },
      durationSecs: parseInt(this.refs.durationSecs.value),
      fixed: false,
      language: this.refs.language.value,
      locationName: { es: this.refs.locationNameES.value },
      locationPoints: [ { coord:{ lat:Number(this.refs.locationPoint0Lat.value),long:Number(this.refs.locationPoint0Long.value)}, radius:Number(this.refs.locationPoint0Radius.value)} ],
      missionType: { es: this.refs.missionTypeES.value },
      objective: { es: this.refs.objetiveES.value },
      reward: { GP: parseInt(this.refs.rewardGP.value) },
      startDate: parseInt(this.refs.startDate.value),
      title: { es: this.refs.titleES.value },
      type: this.refs.type.value,
      images:[this.refs.image1.value,this.refs.image2.value],
      evidenceType: parseInt(this.refs.evidenceType.value)
    }

    this.setState({
      ...this.state,
      savingChanges: true
    })
    if(missionID == 'new'){
      this.props.addProject(st);
    } else {
      this.props.editProject(missionID, st );
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

    //Cosas con Idioma
    var _complexity="",_description="",_locationName="",_missionType="",_objective="",_title="";
    //Objetos
    var _lat=0,_long=0,_radius=0,_rewardGP=0;
    //Directos
    var _startDate=0,_durationSecs=0,_evidenceType=2,_fixed=false,lang="es",_type=""
    //Arreglos
    var _images=[]
    
    const mission = project;

    if(mission != null)
    {
      if(mission.language!=null)
        lang = mission.language
      
      _missionType  = mission.missionType  != null && mission.missionType[lang]  != null ? mission.missionType[lang]  : ""
      _description  = mission.description  != null && mission.description[lang]  != null ? mission.description[lang]  : ""
      _objective    = mission.objective    != null && mission.objective[lang]    != null ? mission.objective[lang]    : ""
      _locationName = mission.locationName != null && mission.locationName[lang] != null ? mission.locationName[lang] : ""
      _title        = mission.title        != null && mission.title[lang]        != null ? mission.title[lang]        : ""
      _complexity   = mission.complexity   != null && mission.complexity[lang]   != null ? mission.complexity[lang]   : ""

      _evidenceType = mission.evidenceType != null ? mission.evidenceType : 2
      _type         = mission.type         != null ? mission.type         : ""
      _fixed        = mission.fixed        != null ? mission.fixed        : false
      _durationSecs = mission.durationSecs != null ? mission.durationSecs : 0
      _startDate    = mission.startDate    != null ? mission.startDate    : 0

      _startDate    = Number(_startDate)
      _durationSecs = Number(_durationSecs)
      if(isNaN(Number(_startDate)))
      _startDate  = 0 
      if(isNaN(Number(_durationSecs)))
      _durationSecs = 0
   
      //Por mientras solo usaremos 1 location. Hacer que esto despues sea como _images

      if(mission.locationPoints != null && mission.locationPoints[0]!=null)
      {
        _lat    = mission.locationPoints[0].coord     != null && mission.locationPoints[0].coord.lat  != null ? mission.locationPoints[0].coord.lat  : 0
        _long   = mission.locationPoints[0].coord     != null && mission.locationPoints[0].coord.long != null ? mission.locationPoints[0].coord.long : 0
        _radius = mission.locationPoints[0].radius    != null ?  mission.locationPoints[0].radius : 0

        _lat    = Number(_lat)
        _long   = Number(_long)
        _radius = Number(_radius)
        if(isNaN(Number(_lat)))
          _lat  = 0 
        if(isNaN(Number(_long)))
          _long = 0
        if(isNaN(Number(_radius)))
        _radius = 0
      }

      _rewardGP = mission.reward != null && mission.reward.GP != null ? mission.reward.GP : 0
      _images   = mission.images != null ? mission.images : []

    }

    if (project) {

      return (
        <div className="container section project-details">
          <button className="btn waves-effect waves-light" onClick={this.handleDelete}>Eliminar</button>
          <div className="card z-depth-0">
            <div className="card-content">
              <form onSubmit={this.handleSubmit} style={{ marginTop: "0px auto" }}>
                <label>
                  Titulo:
                <input defaultValue={_title} ref="titleES" onChange={this.handleChange} />
                </label>
                <label>
                  Complejidad:
                <input defaultValue={_complexity} ref="complexityES" onChange={this.handleChange} />
                </label>
                <label>
                  Descripcion:
                <textarea defaultValue={_description} ref="descriptionES" onChange={this.handleChange} />
                </label>
                <label>
                  Duracion segundos:
                <input type="number" defaultValue={_durationSecs} ref="durationSecs" onChange={this.handleChange} />
                </label>
                <label>
                  Tipo de evidencia:
                <input type="number" defaultValue={_evidenceType} ref="evidenceType" onChange={this.handleChange} />
                </label>
                
                <label>
                  Imagen 1:
                <input defaultValue={_images[0]==null?"":_images[0]} ref="image1" onChange={this.handleChange} />
                </label>
                <label>
                  Imagen 2:
                <input defaultValue={_images[1]==null?"":_images[1]} ref="image2" onChange={this.handleChange} />
                </label>

                <label>
                  Idioma:
                <input defaultValue={lang} ref="language" onChange={this.handleChange} />
                </label>
                <label>
                  Locacion nombre:
                <input defaultValue={_locationName} ref="locationNameES" onChange={this.handleChange} />
                </label>
                <label>
                  Locacion puntos 0 latitud:
                <input defaultValue={_lat} ref="locationPoint0Lat" onChange={this.handleChange} />
                </label>
                <label>
                  Locacion puntos 0 longitud:
                <input defaultValue={_long} ref="locationPoint0Long" onChange={this.handleChange} />
                </label>
                <label>
                  Locacion puntos 0 radio:
                <input defaultValue={_radius} ref="locationPoint0Radius" onChange={this.handleChange} />
                </label>
                <label>
                  Tipo de mision:
                <input defaultValue={_missionType} ref="missionTypeES" onChange={this.handleChange} />
                </label>
                <label>
                  Objetivo:
                <textarea defaultValue={_objective} ref="objetiveES" onChange={this.handleChange} />
                </label>
                <label>
                  Recompensa:
                <input type="number" defaultValue={_rewardGP} ref="rewardGP" onChange={this.handleChange} />
                </label>
                <label>
                  Fecha inicio:
                <input type="number" defaultValue={_startDate} ref="startDate" onChange={this.handleChange} />
                </label>
                <label>
                  Tipo:
                <input defaultValue={_type} ref="type" onChange={this.handleChange} />
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
      fixed: false,
      language: 'es',
      locationName: { es: '' },
      locationPoints: [ { coord:{ lat:0,long:0}, radius:0} ],
      missionType: { es: '' },
      objective: { es: '' },
      reward: { GP: 0 },
      startDate: 0,
      title: { es: '' },
      type: '',
      images:[],
      evidenceType: 2
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
    editProject: (id,capture) => dispatch(editProject(id,capture)),
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