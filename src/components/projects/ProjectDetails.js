import React, { Component } from 'react'
import { connect } from 'react-redux'
import { firestoreConnect } from 'react-redux-firebase'
import { compose } from 'redux'
import { Redirect } from 'react-router-dom'
import { editProject, addProject, deleteProject} from '../../store/actions/projectActions'
import Select from 'react-select';
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css";
import { reduxFirestore, getFirestore } from 'redux-firestore'

const idiomas = [
  { label: "Español", value: "es" },
  { label: "English", value: "en" }
];
const evidencias = [
  { label: "Foto", value: 2 },
  { label: "Sonido", value: 3 },
  { label: "Texto", value: 5 },
  { label: "Video", value: 7 }
];
const complejidad = [
  { label: "Alta",  value:  "Alta" },
  { label: "Media", value: "Media" },
  { label: "Baja",  value:  "Baja" }
];
const tiposUbic = [
  { label: "show", value: "show" },
  { label: "hide", value: "hide" },
  { label: "none", value: "none" }
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
    ddLocType: null,

    timeInit:null,
    timeFinish:null,
    timeDuration:0,
    hashtags: [],
    microtaskUsername: ''
  };

  componentDidMount()
  {
    const id=this.props.location.state._id
    var _mission = {
        complexity: { es: '' },
        description: { es: '' },
        durationSecs: 0,
        fixed: false,
        hasLocation: true,
        needRevision: true,
        language: 'es',
        locationName: { es: '' },
        locationType: '',
        locationPoints: [ { coord:{ lat:0,long:0}, radius:0} ],
        microtask: '',
        missionType: { es: '' },
        objective: { es: '' },
        reward: { GP: 0, points: 0, money: 0 },
        startDate: 0,
        title: { es: '' },
        type: '',
        images:[],
        imagesRef: [],
        evidenceType: 1,
        generic: "",
        hashtags: [],
        rally: { prevMission: '', nextMission: '', position: 0, total: 0, isRally: false},
        pinned: false,
        validatorProperties: '',
        typeform: "",
        mapIcon: "",
        hideCapture: false
      }
      
    this.setState({ddLang:{ label: "Español", value: "es" }});
    this.setState({ ddCom: { label: "Baja", value: "Baja" } });
    this.setState({ ddLocType: { label: "show", value: "show" } });
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
        _mission.locationType = mission.locationType != null ? mission.locationType : "show" }
        _mission.title        = mission.title        != null && mission.title[_mission.language]        != null ? mission.title        : {[_mission.language]:""}
        _mission.complexity   = mission.complexity   != null && mission.complexity[_mission.language]   != null ? mission.complexity   : {[_mission.language]:""}
        
        var assigned = false
        
        if(_mission.complexity[_mission.language] =="Alta")
        {
          this.setState({ddCom:{ label: "Alta", value: "Alta" }});
          assigned = true
        }
        if(_mission.complexity[_mission.language] =="Media")
        {
          this.setState({ddCom:{ label: "Media", value: "Media" }});
          assigned = true
        }
        if(_mission.complexity[_mission.language] =="Baja")
        {
          this.setState({ddCom:{ label: "Baja", value: "Baja" }});
          assigned = true
        }
        if(!assigned)
          this.setState({ddCom:{ label: "Baja", value: "Baja" }});

      assigned = false
      
      if (_mission.locationType == "show") {
        this.setState({ ddLocType: { label: "show", value: "show" } });
        assigned = true
      }
      if (_mission.locationType == "hide") {
        this.setState({ ddLocType: { label: "hide", value: "hide" } });
        assigned = true
      }
      if (_mission.locationType == "none") {
        this.setState({ ddLocType: { label: "none", value: "none" } });
        assigned = true
      }
      if (!assigned)
        this.setState({ ddLocType: { label: "show", value: "show" } });
      
      _mission.evidenceType = mission.evidenceType != null ? mission.evidenceType : 2

      var ddEv = []
      if(_mission.evidenceType%2 == 0)
        ddEv.push(  { label: "Foto", value: 2 })
      if(_mission.evidenceType%3 == 0)
        ddEv.push(  { label: "Sonido", value: 3 })
      if(_mission.evidenceType%5 == 0)
        ddEv.push(  { label: "Texto", value: 5 })
      if (_mission.evidenceType % 7 == 0)
        ddEv.push({ label: "Video", value: 7 })

      this.setState({ddEv})

      _mission.type         = mission.type         != null ? mission.type         : ""
      _mission.generic      = mission.generic      != null ? mission.generic      : ""
      _mission.fixed        = mission.fixed        != null ? mission.fixed        : false
      _mission.hasLocation = mission.hasLocation   != null ? mission.hasLocation  : true
      _mission.needRevision = mission.needRevision != null ? mission.needRevision : true
      _mission.durationSecs = mission.durationSecs != null ? mission.durationSecs : 0
      _mission.reports      = mission.reports      != null ? mission.reports      : 0
      _mission.startDate    = mission.startDate    != null ? mission.startDate    : 0
      _mission.endDate      = mission.endDate      != null ? mission.endDate      : 0
      
      _mission.startDate    = Number(_mission.startDate)
      if(isNaN(Number(_mission.startDate)))
        _mission.startDate  = 0 

      _mission.endDate = Number(_mission.endDate)
      if (isNaN(Number(_mission.endDate)))
        _mission.endDate = 0 

      _mission.durationSecs = Number(_mission.durationSecs)
      if(isNaN(Number(_mission.durationSecs)))
        _mission.durationSecs = 0

      var t1 = new Date()
      t1.setTime(_mission.startDate*1000.0)

      var t2 = new Date()
      t2.setTime(_mission.endDate * 1000.0  )
     
      this.setState({timeInit:t1,timeFinish:t2,timeDuration:_mission.durationSecs})
   
      //Por mientras solo usaremos 1 location. Hacer que esto despues sea como _images

      if(mission.locationPoints != null && mission.locationPoints[0]!=null)
      {
        _mission.locationPoints = mission.locationPoints
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
      _mission.reward.points = mission.reward != null && mission.reward.points != null ? mission.reward.points : 0
      _mission.reward.money = mission.reward != null && mission.reward.money != null ? mission.reward.money : 0
      _mission.images   = mission.images != null ? mission.images : []
      _mission.imagesRef = mission.imagesRef != null ? mission.imagesRef : []

      _mission.rally.prevMission = mission.rally != null && mission.rally.prevMission != null ? mission.rally.prevMission : ''
      _mission.rally.nextMission = mission.rally != null && mission.rally.nextMission != null ? mission.rally.nextMission : ''
      _mission.rally.position = mission.rally != null && mission.rally.position != null ? mission.rally.position : 0
      _mission.rally.total = mission.rally != null && mission.rally.total != null ? mission.rally.total : 0
      _mission.rally.isRally = mission.rally != null && mission.rally.isRally != null ? mission.rally.isRally : false
      _mission.pinned = mission.pinned != null ? mission.pinned : false
      _mission.validatorProperties = mission.validatorProperties != null ? mission.validatorProperties : ""

      _mission.microtask = mission.microtask != null ? mission.microtask : [""]
      _mission.hashtags = mission.hashtags != null ? mission.hashtags : [""]

      _mission.typeform = mission.typeform != null ? mission.typeform : ""
      _mission.mapIcon = mission.mapIcon != null ? mission.mapIcon : ""
      _mission.hideCapture = mission.hideCapture != null ? mission.hideCapture : false
      this.setState({ hashtags: _mission.hashtags})
    }

    if(_mission.microtask != ''){
      getFirestore().get({ collection: "users", doc: _mission.microtask })
        .then((doc) => {
          if (doc != undefined && doc.data().username != null) {
            this.setState({ microtaskUsername: doc.data().username })
          }
        })
        .catch((error) => {
          this.setState({ microtaskUsername: "No se encontro usuario" })
        });
    }
    console.log(id,_mission)
    this.setState({id:id,mission:_mission})
  }

  handleChange = (e) => {
    e.preventDefault();
  }

  handleSubmit = (e) => {
    e.preventDefault();

    const { hashtags } = this.state;
    //alert(`hay ${hashtags.length} hashtags`);
    const {id,ddEv} = this.state
    const lang = this.state.ddLang.value
    const complexity = this.state.ddCom.value
    const locationType = this.state.ddLocType.value
    var evidenceType = 1;
    var mlp = []
    if (this.state.mission != null){
      mlp = this.state.mission.locationPoints
    }
    mlp[0].coord.lat = Number(this.refs.locationPoint0Lat.value)
    mlp[0].coord.long = Number(this.refs.locationPoint0Long.value)
    mlp[0].radius = Number(this.refs.locationPoint0Radius.value)
    for(var i =0;i<ddEv.length;i++)
      evidenceType = evidenceType*ddEv[i].value

    // var fixed = false;
    // if(this.refs.fixed.value=="true")
    //   fixed = true;

    // var isRally = false;
    // if (this.refs.rallyIsRally.value == "true")
    //   isRally = true;

    // var pinned = false;
    // if (this.refs.pinned.value == "true")
    //   pinned = true;

    const mission = {
      complexity: { [lang]: complexity },
      description: { [lang]: this.refs.description.value },
      durationSecs: Number(this.state.timeDuration),
      fixed: this.refs.fixed.checked,
      hideCapture: this.refs.hideCapture.checked,
      hasLocation: this.refs.hasLocation.checked,
      needRevision: this.refs.needRevision.checked,
      language: lang,
      locationName: { [lang]: this.refs.locationName.value },
      locationType: locationType,
      locationPoints: mlp,
      missionType: { [lang]: this.refs.missionType.value },
      objective: { [lang]: this.refs.objetive.value },
      reward: { GP: parseInt(this.refs.rewardGP.value), points: parseInt(this.refs.rewardPoints.value), money: parseInt(this.refs.rewardMoney.value) },
      startDate: Number(this.state.timeInit/1000.0),
      endDate: Number(this.state.timeFinish/1000.0),
      title: { [lang]: this.refs.title.value },
      type: this.refs.type.value,
      generic: this.refs.generic.value,
      images:[this.refs.image1.value,this.refs.image2.value],
      imagesRef: [this.refs.imageRef1.value, this.refs.imageRef2.value],
      evidenceType: Number(evidenceType),
      hashtags: hashtags,
      rally: { prevMission: this.refs.rallyPrevMission.value, nextMission: this.refs.rallyNextMission.value, position: parseInt(this.refs.rallyPosition.value), total: parseInt(this.refs.rallyTotal.value), isRally: this.refs.rallyIsRally.checked },
      pinned: this.refs.pinned.checked,
      validatorProperties: this.refs.validatorProperties.value,
      typeform: this.refs.typeform.value,
      mapIcon: this.refs.mapIcon.value
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

  handleShareholderNameChange = idx => evt => {
    const newHashtags = this.state.hashtags.map((hashtag, sidx) => {
      if (idx !== sidx) return hashtag;
      //console.log(evt.target.value);
      return evt.target.value ;
    });

    this.setState({ hashtags: newHashtags });
  };

  handleSubmitShareHolders = evt => {
    const { name, shareholders } = this.state;
    alert(`Incorporated: ${name} with ${shareholders.length} shareholders`);
  };

  handleAddShareholder = () => {
    this.setState({
      hashtags: this.state.hashtags.concat([ "" ])
    });
  };

  handleRemoveShareholder = idx => () => {
    this.setState({
      hashtags: this.state.hashtags.filter((s, sidx) => idx !== sidx)
    });
  };

  render() {
    const { auth, projectActions } = this.props;
    const {mission,ddLang,ddEv,ddCom,ddLocType,timeInit,timeFinish,timeDuration } = this.state
    if (this.state.savingChanges){
      return <Redirect to='/' /> 
    }
    if (this.state.deletingProject) {
      return <Redirect to='/' />
    }
    if (!auth.uid) return <Redirect to='/singin' /> 
  
    if (mission) {
      const lang = mission.language;
      return (
        
        <div className="container section project-details">
          <button className="btn waves-effect waves-light" onClick={this.handleDelete}>Eliminar</button>
          <div className="card z-depth-0">
            <div className="card-content">
              <form onSubmit={this.handleSubmit} style={{ marginTop: "0px auto" }}>
                <label>
                  ID:
                <input readOnly defaultValue={this.state.id} />
                </label>
                <p>
                  <label>
                    <input type="checkbox" defaultChecked={mission.needRevision} id="needRevision" ref="needRevision" onChange={this.handleChange} />
                    <span>Need revision</span>
                  </label>
                </p>
                <label>
                  Usuario creador:
                <input readOnly defaultValue={this.state.microtaskUsername} />
                </label>
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
                  Path de mision generica:
                <input defaultValue={mission.generic} ref="generic" onChange={this.handleChange} />
                </label>
                <label>
                  Imagen 1:
                <input defaultValue={mission.images[0]==null?"":mission.images[0]} ref="image1" onChange={this.handleChange} />
                </label>
                <label>
                  Referencia imagen 1:
                <input defaultValue={mission.imagesRef[0] == null ? "" : mission.imagesRef[0]} ref="imageRef1" onChange={this.handleChange} />
                </label>
                <label>
                  Imagen 2:
                <input defaultValue={mission.images[1] == null ? "" : mission.images[1]} ref="image2" onChange={this.handleChange} />
                </label>
                <label>
                  Referencia imagen 2:
                <input defaultValue={mission.imagesRef[1]==null?"":mission.imagesRef[1]} ref="imageRef2" onChange={this.handleChange} />
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
                  Tipo de ubicación:
                <Select value={ddLocType} options={tiposUbic} onChange={ddLocType => { this.setState({ ddLocType }) }} />
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
                  Recompensa Points:
                <input type="number" defaultValue={mission.reward.points} ref="rewardPoints" onChange={this.handleChange} />
                </label>
                <label>
                  Recompensa Dinero:
                <input type="number" defaultValue={mission.reward.money} ref="rewardMoney" onChange={this.handleChange} />
                </label>
                <label>
                  URL de servico:
                <input defaultValue={mission.type} ref="type" onChange={this.handleChange} />
                </label>
                <div>
                  <p>
                    <label>
                      <input type="checkbox" defaultChecked={mission.fixed } id="fixed" ref="fixed" onChange={this.handleChange} />
                      <span>Fixed</span>
                    </label>
                  </p>
                  <p>
                    <label>
                      <input type="checkbox" defaultChecked={mission.hasLocation} id="hasLocation" ref="hasLocation" onChange={this.handleChange} />
                      <span>Has location</span>
                    </label>
                  </p>
                  <p>
                    <label>
                      <input type="checkbox" defaultChecked={mission.hideCapture} id="hideCapture" ref="hideCapture" onChange={this.handleChange} />
                      <span>Hide Capture</span>
                    </label>
                  </p>
                  
                  <label>
                    Rally Mission anterior:
                <input defaultValue={mission.rally.prevMission} ref="rallyPrevMission" onChange={this.handleChange} />
                  </label>
                  <label>
                    Rally Mission siguiente:
                <input defaultValue={mission.rally.nextMission} ref="rallyNextMission" onChange={this.handleChange} />
                  </label>
                  <label>
                    Rally Posicion:
                <input type="number" defaultValue={mission.rally.position} ref="rallyPosition" onChange={this.handleChange} />
                  </label>
                  <label>
                    Rally total:
                <input type="number" defaultValue={mission.rally.total} ref="rallyTotal" onChange={this.handleChange} />
                  </label>
                  <p>
                    <label>
                      <input type="checkbox" defaultChecked={mission.rally.isRally} id="rallyIsRally" ref="rallyIsRally" onChange={this.handleChange} />
                      <span>Es rally</span>
                    </label>
                  </p>
                  <p>
                    <label>
                      <input type="checkbox" defaultChecked={mission.pinned} id="pinned" ref="pinned" onChange={this.handleChange} />
                      <span>Fijado</span>
                    </label>
                  </p>
                    <label>
                      ValidatorProperties:
                <textarea defaultValue={mission.validatorProperties} ref="validatorProperties" onChange={this.handleChange} />
                    </label>
                  <label>
                    Typeform:
                  <input defaultValue={mission.typeform} ref="typeform" onChange={this.handleChange} />
                  </label>
                  <label>
                    MapIcon:
                  <input defaultValue={mission.mapIcon} ref="mapIcon" onChange={this.handleChange} />
                  </label>
                  <label>
                   Reportes:
                  <input readOnly type="number" value={mission.reports} ref="reports" />
                  </label>
                  
                
                </div>
                <form onSubmit={this.handleSubmitShareHolders}>
                  {/* ... */}
                  {/* <h4>Shareholders</h4> */}

                  {this.state.hashtags.map((hashtag, idx) => (
                    <div className="shareholder">
                      <label>
                        Hashtag #{idx + 1}:
                      <input
                        type="text"
                        placeholder={`Hashtag #${idx + 1}`}
                          value={hashtag}
                        onChange={this.handleShareholderNameChange(idx)}
                          style={{ width: "auto" }}
                      />
                      </label>
                      <button
                        type="button"
                        onClick={this.handleRemoveShareholder(idx)}
                        className="small"
                      >
                        -
            </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={this.handleAddShareholder}
                    className="small"
                  >
                    Agregar Hashtag
        </button>
                  {/* <button>Incorporate</button> */}
                </form>
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