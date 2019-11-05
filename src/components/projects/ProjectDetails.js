import React, { Component } from 'react'
import { connect } from 'react-redux'
import { firestoreConnect } from 'react-redux-firebase'
import { compose } from 'redux'
import { Redirect } from 'react-router-dom'
import { editProject, addProject, deleteProject} from '../../store/actions/projectActions'
import Select from 'react-select';
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css";
const idiomas = [
  { label: "Español", value: "es" },
  { label: "English", value: "en" }
];
const evidencias = [
  { label: "Foto", value: 2 },
  { label: "Sonido", value: 3 },
  { label: "Texto", value: 5 }
];
const complejidad = [
  { label: "Alta",  value:  "Alta" },
  { label: "Media", value: "Media" },
  { label: "Baja",  value:  "Baja" }
];

class ProjectDetails extends Component {

  state = {
    savingChanges: false,
    projectLoaded: true,
    deletingProject: false,

    id: null,
    mission: null,

    ddLang :  null,
    ddEv : [],
    ddCom: null,

    timeInit:null,
    timeFinish:null,
    timeDuration:0
  };

  componentDidMount()
  {
    const id=this.props.location.state.id
    var _mission = {
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
        evidenceType: 1
      }
      
    this.setState({ddLang:{ label: "Español", value: "es" }});
    var mission=null
    if(id != null && id != "new")
      mission = this.props.location.state
    var t0 = new Date();
    this.setState({timeInit:t0,timeFinish:t0,timeDuration:0})
    if(mission != null)
    {
      if(mission.language!=null)
      {
        _mission.language = mission.language
        if(mission.language=="es")
        this.setState({ddLang:{ label: "Español", value: "es" }});
        if(mission.language=="en")
        this.setState({ddLang:{ label: "English", value: "en" }});

        _mission.missionType  = mission.missionType  != null && mission.missionType[_mission.language]  != null ? mission.missionType  : {[_mission.language]:""}
        _mission.description  = mission.description  != null && mission.description[_mission.language]  != null ? mission.description  : {[_mission.language]:""}
        _mission.objective    = mission.objective    != null && mission.objective[_mission.language]    != null ? mission.objective    : {[_mission.language]:""}
        _mission.locationName = mission.locationName != null && mission.locationName[_mission.language] != null ? mission.locationName : {[_mission.language]:""}
        _mission.title        = mission.title        != null && mission.title[_mission.language]        != null ? mission.title        : {[_mission.language]:""}
        _mission.complexity   = mission.complexity   != null && mission.complexity[_mission.language]   != null ? mission.complexity   : {[_mission.language]:""}

        if(_mission.complexity[_mission.language] =="Alta")
          this.setState({ddCom:{ label: "Alta", value: "Alta" }});
        if(_mission.complexity[_mission.language] =="Media")
          this.setState({ddCom:{ label: "Media", value: "Media" }});
        if(_mission.complexity[_mission.language] =="Baja")
          this.setState({ddCom:{ label: "Baja", value: "Baja" }});

      }
      
      _mission.evidenceType = mission.evidenceType != null ? mission.evidenceType : 2

      var ddEv = []
      if(_mission.evidenceType%2 == 0)
        ddEv.push(  { label: "Foto", value: 2 })
      if(_mission.evidenceType%3 == 0)
        ddEv.push(  { label: "Sonido", value: 3 })
      if(_mission.evidenceType%5 == 0)
        ddEv.push(  { label: "Texto", value: 5 })

      this.setState({ddEv})

      _mission.type         = mission.type         != null ? mission.type         : ""
      _mission.fixed        = mission.fixed        != null ? mission.fixed        : false
      _mission.durationSecs = mission.durationSecs != null ? mission.durationSecs : 0
      _mission.startDate    = mission.startDate    != null ? mission.startDate    : 0
      
      _mission.startDate    = Number(_mission.startDate)
      _mission.durationSecs = Number(_mission.durationSecs)
      if(isNaN(Number(_mission.startDate)))
        _mission.startDate  = 0 
      if(isNaN(Number(_mission.durationSecs)))
        _mission.durationSecs = 0

      var t1 = new Date()
      t1.setTime(_mission.startDate*1000.0)
      var t2 = new Date()
      t2.setTime((_mission.startDate+_mission.durationSecs)*1000.0  )
     
      this.setState({timeInit:t1,timeFinish:t2,timeDuration:_mission.durationSecs})
   
      //Por mientras solo usaremos 1 location. Hacer que esto despues sea como _images

      if(mission.locationPoints != null && mission.locationPoints[0]!=null)
      {
        _mission.locationPoints[0].coord.lat    = mission.locationPoints[0].coord     != null && mission.locationPoints[0].coord.lat  != null ? mission.locationPoints[0].coord.lat  : 0
        _mission.locationPoints[0].coord.long   = mission.locationPoints[0].coord     != null && mission.locationPoints[0].coord.long != null ? mission.locationPoints[0].coord.long : 0
        _mission.locationPoints[0].radius       = mission.locationPoints[0].radius    != null ?  mission.locationPoints[0].radius : 0

        _mission.locationPoints[0].coord.lat    = Number(_mission.locationPoints[0].coord.lat)
        _mission.locationPoints[0].coord.long   = Number(_mission.locationPoints[0].coord.long)
        _mission.locationPoints[0].radius = Number(_mission.locationPoints[0].radius)
        if(isNaN(Number(_mission.locationPoints[0].coord.lat)))
          _mission.locationPoints[0].coord.lat  = 0 
        if(isNaN(Number(_mission.locationPoints[0].coord.long)))
          _mission.locationPoints[0].coord.long = 0
        if(isNaN(Number(_mission.locationPoints[0].radius)))
        _mission.locationPoints[0].radius = 0
      }

      _mission.reward.GP = mission.reward != null && mission.reward.GP != null ? mission.reward.GP : 0
      _mission.images   = mission.images != null ? mission.images : []

    }
    console.log(id,_mission)
    this.setState({id:id,mission:_mission})
  }

  handleChange = (e) => {
    e.preventDefault();
  }

  handleSubmit = (e) => {
    e.preventDefault();
    
    const {id,ddEv} = this.state
    const lang = this.state.ddLang.value
    const complexity = this.state.ddCom.value
    var evidenceType = 1;
    for(var i =0;i<ddEv.length;i++)
      evidenceType = evidenceType*ddEv[i].value
    var fixed = false;
    if(this.refs.fixed.value=="true")
      fixed = true;
    const mission = {
      complexity: { [lang]: complexity },
      description: { [lang]: this.refs.description.value },
      durationSecs: Number(this.state.timeDuration),
      fixed: fixed,
      language: lang,
      locationName: { [lang]: this.refs.locationName.value },
      locationPoints: [ { coord:{ lat:Number(this.refs.locationPoint0Lat.value),long:Number(this.refs.locationPoint0Long.value)}, radius:Number(this.refs.locationPoint0Radius.value)} ],
      missionType: { [lang]: this.refs.missionType.value },
      objective: { [lang]: this.refs.objetive.value },
      reward: { GP: parseInt(this.refs.rewardGP.value) },
      startDate: Number(this.state.timeInit/1000.0),
      title: { [lang]: this.refs.title.value },
      type: this.refs.type.value,
      generic: this.refs.generic.value,
      images:[this.refs.image1.value,this.refs.image2.value],
      evidenceType: Number(evidenceType)
    }
    this.setState({
      ...this.state,
      savingChanges: true
    })
    if(id == 'new'){
      this.props.addProject(mission);
    } else {
      this.props.editProject(id, mission );
    }
  }

  handleDelete = (e) => {
    e.preventDefault();
    const {id} = this.state
    this.setState({
      ...this.state,
      deletingProject: true
    })
    this.props.deleteProject(id);
  }

  
  setTimeDuration = (value) => {
    var newFinish = new Date()
    newFinish.setTime(Number(this.state.timeInit)+(value.target.value*1000))
    this.setState({
      timeDuration:value.target.value,
      timeFinish:newFinish
    })
  }
  setTimeInit = (value) => {
    var tD = this.state.timeFinish - value
    this.setState({
      timeInit:value,
      timeDuration:tD/1000.0
    })
  }
  setTimeFinish = (value) => {
    var tD = value-this.state.timeInit
    this.setState({
      timeFinish:value,
      timeDuration:tD/1000.0
    })
  }

  render() {
    const { auth, projectActions } = this.props;
    const {mission,ddLang,ddEv,ddCom,timeInit,timeFinish,timeDuration } = this.state
    if (this.state.savingChanges){
      return <Redirect to='/' /> 
    }
    if (this.state.deletingProject) {
      return <Redirect to='/' />
    }
    if (!auth.uid) return <Redirect to='/singin' /> 

      _generic      = mission.generic      != null ? mission.generic : ""
    

    if (mission) {
      const lang = mission.language;
      return (
        
        <div className="container section project-details">
          <button className="btn waves-effect waves-light" onClick={this.handleDelete}>Eliminar</button>
          <div className="card z-depth-0">
            <div className="card-content">
              <form onSubmit={this.handleSubmit} style={{ marginTop: "0px auto" }}>
                <label>
                  Titulo:
                <input defaultValue={mission.title[lang]} ref="title" onChange={this.handleChange} />
                </label>
                <div>
                <label>
                  Fecha de inicio.
                </label>
                </div>
                <div>
                <DatePicker selected={timeInit} onChange={timeInit =>this.setTimeInit(timeInit)} 
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                timeCaption="time"
                dateFormat="MMMM d, yyyy h:mm aa"
                />
                </div> 
                <div>
                <label>
                  Fecha de terminación.
                </label>
                </div>
                <div>
                <DatePicker selected={timeFinish} onChange={timeFinish =>this.setTimeFinish(timeFinish)} 
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                timeCaption="time"
                dateFormat="MMMM d, yyyy h:mm aa"
                />
                
                </div>
                <label>
                  Duración en segundos. Si se deja en 0, la mision no tendra tiempo de expiración.
                  <input type="number" value={this.state.timeDuration} ref="durationSecs" onChange={value => this.setTimeDuration(value)} />
               </label>
                <label>
                  Complejidad:
                <Select value={ddCom} options={ complejidad } onChange={ddCom => {this.setState({ddCom})}} />
                </label>
                <label>
                  Descripcion:
                <textarea defaultValue={mission.description[lang]} ref="description" onChange={this.handleChange} />
                </label>
                
                <label>
                  Tipo de evidencia:
               
                  <Select isMulti value={ddEv} options={ evidencias } onChange={ddEv => {this.setState({ddEv})} } />
                </label>
               
                <label>
                  Imagen 1:
                <input defaultValue={mission.images[0]==null?"":mission.images[0]} ref="image1" onChange={this.handleChange} />
                </label>
                <label>
                  Imagen 2:
                <input defaultValue={mission.images[1]==null?"":mission.images[1]} ref="image2" onChange={this.handleChange} />
                </label>

                <label>
                  Idioma:
                </label>
                <Select value={ddLang} options={ idiomas } onChange={ddLang => {this.setState({ddLang})}} />

                <label>
                  Nombre de la ubicación:
                <input defaultValue={mission.locationName[lang]} ref="locationName" onChange={this.handleChange} />
                </label>
                <label>
                  Coordenada Latitud:
                <input defaultValue={mission.locationPoints[0].coord.lat} ref="locationPoint0Lat" onChange={this.handleChange} />
                </label>
                <label>
                  Coordenada Longitud:
                <input defaultValue={mission.locationPoints[0].coord.long} ref="locationPoint0Long" onChange={this.handleChange} />
                </label>
                <label>
                 Radio en metros:
                <input defaultValue={mission.locationPoints[0].radius} ref="locationPoint0Radius" onChange={this.handleChange} />
                </label>
                <label>
                  Tipo de mision:
                <input defaultValue={mission.missionType[lang]} ref="missionType" onChange={this.handleChange} />
                </label>
                <label>
                  Objetivo:
                <textarea defaultValue={mission.objective[lang]} ref="objetive" onChange={this.handleChange} />
                </label>
                <label>
                  Recompensa Gotchupesos:
                <input type="number" defaultValue={mission.reward.GP} ref="rewardGP" onChange={this.handleChange} />
                </label>
               
                <label>
                  URL de servico:
                <input defaultValue={mission.type} ref="type" onChange={this.handleChange} />
                </label>
                <div>
                <label>
                  Fixed [true,false]. Si esta en true, la mision no tendra URL de servicio, tiempo ni ubicación:
                  <div>
                <input  defaultValue={mission.fixed} ref="fixed" onChange={this.handleChange} />
                </div>
                </label>
                </div>
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
              <div>Mission by USER</div>
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
      generic: '',
  return {
    id: id,
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

export default connect(mapStateToProps, mapDispathToProps) (ProjectDetails)