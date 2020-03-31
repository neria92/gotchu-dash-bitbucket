import React, { Component } from 'react'
import { reduxFirestore, getFirestore } from 'redux-firestore'

class CaptureSummary extends Component {
  state = {
    username: "",
    mission: ""
  }

  componentDidMount(){
    console.log(this.props.capture.mission)
    getFirestore().get({ collection: "users", doc: this.props.capture.userId })
      .then((doc) => {
        if (doc != undefined && doc.data().username != null) {
          this.setState({ username: doc.data().username})
        }
      })
      .catch((error) => {

        this.setState({ username:"Error - No Existe Usuario" })
      });
      
    getFirestore().get({ collection: "missions", doc: this.props.capture.mission })
      .then((doc) => {
        if (doc != undefined && doc.data().title.es != null) {
          this.setState({ mission: doc.data().title.es })
        }
      })
      .catch((error) => {
        this.setState({ mission: "Error - No existe Mision" })
      });
  }

  render()
  {

    return (
      <div className="card z-depth-0 project-summary">
        <div className="card-content grey-text text-darken-3">
          <span className="card-title ">{this.state.mission}</span>
          <span className="card-title ">{this.state.username}</span>
          {/* <p>Posted by {user.creator}</p> */}
        </div>
      </div>
    )
  }
}


export default CaptureSummary