import React, { Component } from 'react'
import { connect } from 'react-redux'
import { firestoreConnect } from 'react-redux-firebase'
import { compose } from 'redux'
import { Redirect } from 'react-router-dom'
import {editUser} from '../../store/actions/userActions'
import { functions } from 'firebase'

class CaptureDetails extends Component {

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
      locationPoints: [{ coord: { lat: Number(this.refs.locationPoint0Lat.value), long: Number(this.refs.locationPoint0Long.value) }, radius: Number(this.refs.locationPoint0Radius.value) }],
      missionType: { es: this.refs.missionTypeES.value },
      objective: { es: this.refs.objetiveES.value },
      reward: { GP: parseInt(this.refs.rewardGP.value) },
      startDate: parseInt(this.refs.startDate.value),
      title: { es: this.refs.titleES.value },
      type: this.refs.type.value,
      generic: this.refs.generic.value,
      images: [this.refs.image1.value, this.refs.image2.value],
      evidenceType: parseInt(this.refs.evidenceType.value)
    }

    this.setState({
      ...this.state,
      savingChanges: true
    })
    if (missionID == 'new') {
      this.props.addProject(st);
    } else {
      this.props.editProject(missionID, st);
    }
  }
  
  render() {
    const { capture, auth, captureActions } = this.props;
    console.log("saving: " + this.state.savingChanges + " reducer: " + captureActions.projectSaved)
    if (this.state.savingChanges && captureActions.captureSaved) {
      return <Redirect to='/' />
    }
    if (this.state.deletingProject && captureActions.captureDeleted) {
      return <Redirect to='/' />
    }
    if (!auth.uid) return <Redirect to='/singin' />

    //Objetos
    var _lat = 0, _long = 0
    //Directos
    var _createdAt = 0, _photo = "", _sound = "", _text = ""

    const _capture = capture;

    if (_capture != null) {

      _photo = _capture.evidence != null && _capture.evidence.photo != null ? _capture.evidence.photo : ""
      _sound = _capture.evidence != null && _capture.evidence.sound != null ? _capture.evidence.sound : ""
      _text = _capture.evidence != null && _capture.evidence.text != null ? _capture.evidence.text : ""

      _createdAt = _capture.createdAt != null ? _capture.createdAt : 0

      _createdAt = Number(_createdAt)
      if (isNaN(Number(_createdAt)))
        _createdAt = 0

      //Por mientras solo usaremos 1 location. Hacer que esto despues sea como _images

      if (_capture.coords != null) {
        _lat = _capture.coords.lat != null ? _capture.coords.lat : 0
        _long = _capture.coords.long != null ? _capture.coords.long : 0

        _lat = Number(_lat)
        _long = Number(_long)
        if (isNaN(Number(_lat)))
          _lat = 0
        if (isNaN(Number(_long)))
          _long = 0
      }
    }

    if (_capture) {

      return (
        <div className="container section project-details">
          <button className="btn waves-effect waves-light" onClick={this.handleDelete}>Eliminar</button>
          <div className="card z-depth-0">
            <div className="card-content">
              <form onSubmit={this.handleSubmit} style={{ marginTop: "0px auto" }}>
                {/* <label>
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
                  Generic:
                <input defaultValue={_generic} ref="generic" onChange={this.handleChange} />
                </label>
                <label>
                  Tipo de evidencia:
                <input type="number" defaultValue={_evidenceType} ref="evidenceType" onChange={this.handleChange} />
                </label>

                <label>
                  Imagen 1:
                <input defaultValue={_images[0] == null ? "" : _images[0]} ref="image1" onChange={this.handleChange} />
                </label>
                <label>
                  Imagen 2:
                <input defaultValue={_images[1] == null ? "" : _images[1]} ref="image2" onChange={this.handleChange} />
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
                <button className="btn waves-effect waves-light" type="submit" name="action">Guardar</button> */}
              </form>

              {/* <form onSubmit={this.handleSubmit} className="white">
              <span className="card-title">{project.title}</span>
                <input type="textArea" defaultValue={project.antecedentes} id="antecedentes" onChange={this.handleChange} />
              <button className="btn black lighten-1 z-depth-0">Submit Capture</button>
              </form> */}
            </div>
            <div className="card-action grey lighten-4 grey-text">
              {/* <div>Mission by {project.creator}</div> */}
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
    editUser: (capture) => dispatch(editUser(capture))
  }
}

export default compose(
  connect(mapStateToProps, mapDispathToProps),
  firestoreConnect([{
    collection: 'captures'
  }])
)(CaptureDetails)