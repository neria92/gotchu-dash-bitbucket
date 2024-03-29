import React, { Component } from 'react'
import { connect } from 'react-redux'
import { firestoreConnect } from 'react-redux-firebase'
import { compose } from 'redux'
import { Redirect } from 'react-router-dom'
import { editCapture, deleteCapture, showOnlyPending } from '../../store/actions/captureActions'
import { functions } from 'firebase'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css";
import Select from 'react-select';
import { getFirestore } from 'redux-firestore'

const status = [
  { label: "Rejected", value: "Rejected" },
  { label: "Accepted", value: "Accepted" },
  { label: "Pending", value: "Pending" },
];

class CaptureDetails extends Component {

  state = {
    savingChanges: false,
    projectLoaded: true,
    deletingCapture: false,

    id: null,
    capture: null,
    ddStatus: null,

    lat: 0,
    long: 0,
    timeCreatedAt: null,
    missionDescription: '',
    missionObjective: ''
  };

  componentDidMount() {
    const id = this.props.location.state._id
    // var _capture = {
    //   coord: {lat: 0, long:0},
    //   createdAt: 0,
    //   evidence: { photo: "", sound: "", text: "", video: ""},
    //   mission: "",
    //   status: "",
    //   userId: "",
    // }
    var _capture = this.props.location.state

    var capture = null
    if (id != null && id != "new")
      capture = this.props.location.state
    var t0 = new Date();
    this.setState({ createdAt: t0  })
    
    if (capture != null) {
      _capture.coord.lat = capture.coord != null && capture.coord.lat != null ? capture.coord.lat : "" 
      _capture.coord.long = capture.coord != null && capture.coord.long != null ? capture.coord.long : "" 
      _capture.createdAt = capture.createdAt != null ? capture.createdAt : 0
      _capture.createdAt = Number(_capture.createdAt)
      if (isNaN(Number(_capture.createdAt)))
        _capture.createdAt = 0
      var t1 = new Date()
      t1.setTime(_capture.createdAt * 1000.0)
      this.setState({ timeCreatedAt: t1 })
      _capture.evidence.photo = capture.evidence != null && capture.evidence.photo != null ? capture.evidence.photo : "" 
      _capture.evidence.sound = capture.evidence != null && capture.evidence.sound != null ? capture.evidence.sound : "" 
      _capture.evidence.text = capture.evidence != null && capture.evidence.text != null ? capture.evidence.text : "" 
      _capture.evidence.video = capture.evidence != null && capture.evidence.video != null ? capture.evidence.video : "" 
      _capture.mission = capture.mission != null ? capture.mission : ""
      _capture.userId = capture.userId != null ? capture.userId : "" 
      _capture.status = capture.status != null ? capture.status : ""
      _capture.reports = capture.reports != null ? capture.reports : 0

      var assigned = false
      console.log(this.props.location.state)
      if(_capture.status == "Rejected")
      {
        this.setState({ddStatus:{label: "Rejected", value: "Rejected"}});
        assigned = true;
      }
      if (_capture.status == "Accepted") {
        this.setState({ ddStatus: { label: "Accepted", value: "Accepted" } });
        assigned = true;
      }
      if (_capture.status == "Pending") {
        this.setState({ ddStatus: { label: "Pending", value: "Pending" } });
        assigned = true;
      }
      if (!assigned)
        this.setState({ ddStatus: { label: "Rejected", value: "Rejected" } });
    }

    this.setState({ id: id, capture: _capture })

    getFirestore().get({ collection: "missions", doc: capture.mission })
      .then((doc) => {
        if (doc != undefined && doc.data().description != undefined && doc.data().description.es != null) {
          this.setState({ missionDescription: doc.data().description.es })
        }
        if (doc != undefined && doc.data().objective != undefined && doc.data().objective.es != null) {
          this.setState({ missionObjective: doc.data().objective.es })
        }
      })
      .catch((error) => {
        this.setState({ missionDescription: "Error" })
        this.setState({ missionObjective: "Error" })
      });  
  }

  handleChange = (e) => {
    e.preventDefault();
  }

  handleDelete = (e) => {
    e.preventDefault();
    const { id } = this.state
    this.setState({
      ...this.state,
      deletingCapture: true
    })
    this.props.deleteCapture(id);
  }

  handleSubmit = (e) => {
    e.preventDefault();

    const { id } = this.state
    var status = this.state.ddStatus.value

    // const capture = {
    //   coord: { lat: Number(this.refs.lat.value), long: Number(this.refs.long.value) },
    //   createdAt: Number(this.state.timeCreatedAt / 1000.0),
    //   evidence: { photo: this.refs.photo.value, sound: this.refs.sound.value, text: this.refs.text.value, video: this.refs.video.value },
    //   mission: this.refs.mission.value,
    //   status: status,
    //   userId: this.refs.userId.value,
    // }

    var capture = this.state.capture
    console.log(this.state.capture)
    capture.coord.lat = Number(this.refs.lat.value)
    capture.coord.long = Number(this.refs.long.value)
    capture.createdAt = Number(this.state.timeCreatedAt / 1000.0)
    capture.evidence.photo = this.refs.photo.value
    capture.evidence.sound = this.refs.sound.value
    capture.evidence.text = this.refs.text.value
    capture.evidence.video = this.refs.video.value
    capture.mission = this.refs.mission.value
    capture.status = status
    capture.userId = this.refs.userId.value

    this.setState({
      ...this.state,
      savingChanges: true
    })
    if (id == 'new') {
      this.props.addProject(capture);
    } else {
      this.props.editCapture(id, capture);
    }
  }

  setTimeCreatedAt = (value) => {
    this.setState({
      timeCreatedAt: value,
    })
  }
  
  render() {
    const { auth, projectActions } = this.props;
    const { capture, lat, long, timeCreatedAt, ddStatus, missionDescription, missionObjective } = this.state
    if (this.state.savingChanges) {
      return <Redirect to='/captures' />
    }
    if (this.state.deletingCapture) {
      return <Redirect to='/captures' />
    }
    if (!auth.uid) return <Redirect to='/singin' />

    if (capture && missionObjective) {
      return (
        <div className="container section project-details">
          <button className="btn waves-effect waves-light" onClick={this.handleDelete}>Eliminar</button>
          <div className="card z-depth-0">
            <div className="card-content">
              <form onSubmit={this.handleSubmit} style={{ marginTop: "0px auto" }}>
                <label>
                  Descripción de la misión:
                <textarea readOnly defaultValue={this.state.missionDescription} />
                </label>
                <label>
                  Objetivo de la misión:
                <textarea readOnly defaultValue={this.state.missionObjective} />
                </label>
                <label>
                  Latitude:
                <input type="number" defaultValue={capture.coord.lat} ref="lat" onChange={this.handleChange} />
                </label>
                <label>
                  Longitud:
                <input type="number" defaultValue={capture.coord.long} ref="long" onChange={this.handleChange} />
                </label>
                <div>
                  <label>
                    Fecha de captura:
                </label>
                </div>
                <div>
                  <DatePicker selected={timeCreatedAt} onChange={timeCreatedAt => this.setTimeCreatedAt(timeCreatedAt)}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    timeCaption="time"
                    dateFormat="MMMM d, yyyy h:mm aa"
                  />
                </div>
                <label>
                  Status:
                <Select value={ddStatus} options={status} onChange={ddStatus => { this.setState({ ddStatus }) }} />
                </label>
                <label>
                  Photo evidencia:
                <input defaultValue={capture.evidence.photo} ref="photo" onChange={this.handleChange} />
                </label>

                {capture.evidence.photo && <div><img src={capture.evidence.photo} style={{ maxWidth: "-webkit-fill-available" }} /> </div>}

                <label>
                  Sonido evidencia:
                <input defaultValue={capture.evidence.sound} ref="sound" onChange={this.handleChange} />
                </label>
                <label>
                  Texto evidencia:
                <input defaultValue={capture.evidence.text} ref="text" onChange={this.handleChange} />
                </label>
                <label>
                  Video evidencia:
                <input defaultValue={capture.evidence.video} ref="video" onChange={this.handleChange} />
                </label>

                {capture.evidence.video &&
                  <div><video controls src={capture.evidence.video} style={{ maxWidth: "-webkit-fill-available" }} /> </div>
                }
                
                <label>
                  missionId:
                <input defaultValue={capture.mission} ref="mission" onChange={this.handleChange} />
                </label>
                <label>
                  userId:
                <input defaultValue={capture.userId} ref="userId" onChange={this.handleChange} />
                </label>
                <label>
                  Reportes:
                  <input readOnly type="number" value={capture.reports} ref="reports" />
                </label>

                <button className="btn waves-effect waves-light" type="submit" name="action">Guardar</button>
              </form>

              {/* <form onSubmit={this.handleSubmit} className="white">
              <span className="card-title">{project.title}</span>
                <input type="textArea" defaultValue={project.antecedentes} id="antecedentes" onChange={this.handleChange} />
              <button className="btn black lighten-1 z-depth-0">Submit Capture</button>
              </form> */}
            </div>
          </div>
        </div>
      )
    } else {
      return (
        <div className="container center">
          <p>Loading capture...</p>
        </div>
      )
    }
  }
}

const mapStateToProps = (state, ownProps) => {
  const id = ownProps.match.params.id;
  const captures = state.firestore.data.captures;
  const capture = captures ? captures[id] : null;
  
  return {
    id: id,
    capture: capture,
    auth: state.firebase.auth,
    captureActions: state.captureReducer
  }
}

const mapDispathToProps = (dispatch) => {
  return {
    editCapture: (id, capture) => dispatch(editCapture(id, capture)),
    deleteCapture: (capture) => dispatch(deleteCapture(capture)),
    showOnlyPending: (sop) => dispatch(showOnlyPending(sop)),
  }
}

export default compose(
  connect(mapStateToProps, mapDispathToProps),
  firestoreConnect([{
    collection: 'captures'
  }])
)(CaptureDetails)