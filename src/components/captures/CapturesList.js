import React, { Component } from 'react'
import { connect } from 'react-redux'
import { firestoreConnect } from 'react-redux-firebase'
import { compose } from 'redux'
import CaptureSummary from './CaptureSummary'
import { Link } from 'react-router-dom'

class CapturesList extends Component {
  render(){
    if (this.props.captures){
      return (
        <div className="project-list section">
          {this.props.captures.map(capture => {
            return (
              <Link to={'/capture/' + capture.id} key={capture.id}>
                <CaptureSummary capture={capture} />
              </Link>
            )
          })}
        </div>
      )
    } else {
      return (
        <div className="container center">
          <p>Loading captures...</p>
        </div>
      )
    }
  }
}

const mapStateToProps = (state) => {
  return {
    captures: state.firestore.ordered.capture,
  }
}

export default compose(
  connect(mapStateToProps),
  firestoreConnect(props => {
    //console.log(props.filter.charAt(0).toUpperCase() + props.filter.slice(1))
    return [
      { collection: 'capture', where: [['userId', '>=', props.filter]], orderBy: ['userId', 'asc'] }
    ]
  }),
)(CapturesList)