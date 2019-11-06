import React, { Component } from 'react'
import { connect } from 'react-redux'
import { firestoreConnect } from 'react-redux-firebase'
import { compose } from 'redux'
import { Redirect } from 'react-router-dom'
import { editCapture} from '../../store/actions/captureActions'
import { functions } from 'firebase'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css";

class CaptureDetails extends Component {

  state = {
    savingChanges: false,
    projectLoaded: true,
    deletingProject: false,

    id: null,
    capture: null,

    lat: 0,
    long: 0,
    timeCreatedAt: null,
  };

  componentDidMount() {
    const id = this.props.location.state.id
    console.log(this.props.location)
    var _capture = {
      coords: {lat: 0, long:0},
      createdAt: 0,
      evidence: { photo: "", sound: "", text: ""},
      mission: "",
      userId: "",
    }

    var capture = null
    if (id != null && id != "new")
      capture = this.props.location.state
    var t0 = new Date();
    this.setState({ createdAt: t0  })
    
    if (capture != null) {
      _capture.coords.lat = capture.coords != null && capture.coords.lat != null ? capture.coords.lat : "" 
      _capture.coords.long = capture.coords != null && capture.coords.long != null ? capture.coords.long : "" 
      _capture.createdAt = capture.createdAt != null ? capture.createdAt.seconds : 0
      _capture.createdAt = Number(_capture.createdAt)
      if (isNaN(Number(_capture.createdAt)))
        _capture.createdAt = 0
      var t1 = new Date()
      t1.setTime(_capture.createdAt * 1000.0)
      this.setState({ timeCreatedAt: t1 })
      _capture.evidence.photo = capture.evidence != null && capture.evidence.photo != null ? capture.evidence.photo : "" 
      _capture.evidence.sound = capture.evidence != null && capture.evidence.sound != null ? capture.evidence.sound : "" 
      _capture.evidence.text = capture.evidence != null && capture.evidence.text != null ? capture.evidence.text : "" 
      _capture.mission = capture.mission != null ? capture.mission : ""
      _capture.userId = capture.userId != null ? capture.userId : "" 
    }
    console.log(id, _capture)
    this.setState({ id: id, capture: _capture })
  }

  handleChange = (e) => {
    e.preventDefault();
  }

  handleSubmit = (e) => {
    e.preventDefault();

    const { id } = this.state

    const capture = {
      coords: { lat: Number(this.state.lat), long: Number(this.state.long) },
      createdAt: Number(this.state.timeCreatedAt / 1000.0),
      evidence: { photo: this.refs.photo.value, sound: this.refs.sound.value, text: this.refs.text.value },
      mission: this.refs.mission.value,
      userId: this.refs.userId.value,
    }
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
    const { capture, lat, long, timeCreatedAt } = this.state
    if (this.state.savingChanges) {
      return <Redirect to='/captures' />
    }
    if (this.state.deletingProject) {
      return <Redirect to='/' />
    }
    if (!auth.uid) return <Redirect to='/singin' />

    if (capture) {
      return (

        <div className="container section project-details">
          <button className="btn waves-effect waves-light" onClick={this.handleDelete}>Eliminar</button>
          <div className="card z-depth-0">
            <div className="card-content">
              <form onSubmit={this.handleSubmit} style={{ marginTop: "0px auto" }}>
                <label>
                  Latitude:
                <input type="number" defaultValue={capture.coords.lat} ref="lat" onChange={this.handleChange} />
                </label>
                <label>
                  Longitud:
                <input type="number" defaultValue={capture.coords.long} ref="long" onChange={this.handleChange} />
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
                  Photo evidencia:
                <input defaultValue={capture.evidence.photo} ref="photo" onChange={this.handleChange} />
                </label>
                <label>
                  Sonido evidencia:
                <input defaultValue={capture.evidence.sound} ref="sound" onChange={this.handleChange} />
                </label>
                <label>
                  Texto evidencia:
                <input defaultValue={capture.evidence.text} ref="text" onChange={this.handleChange} />
                </label>
                <label>
                  missionId:
                <input defaultValue={capture.mission} ref="mission" onChange={this.handleChange} />
                </label>
                <label>
                  userId:
                <input defaultValue={capture.userId} ref="userId" onChange={this.handleChange} />
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
    editCapture: (id, capture) => dispatch(editCapture(id, capture))
  }
}

export default compose(
  connect(mapStateToProps, mapDispathToProps),
  firestoreConnect([{
    collection: 'captures'
  }])
)(CaptureDetails)