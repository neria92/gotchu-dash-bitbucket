import React, { Component } from 'react'
import { connect } from 'react-redux'
import { firestoreConnect } from 'react-redux-firebase'
import { compose } from 'redux'
import CaptureSummary from './CaptureSummary'
import { Link } from 'react-router-dom'
import Pagination from "react-js-pagination";

class CapturesList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activePage: 1,
      showOnlyPending: false,
      capturesToShow: [], 
      lastCaptures: []
    };
  }

  handlePageChange = (pageNumber) => {
    this.setState({ activePage: pageNumber });
  }

  handleshowOnlyPending = (e) => {
    var sop = false
    if (this.refs.showOnlyPending.checked)
      sop = true
    var captureAux = []
    if (sop) {
      for (var i = 0; i < this.props.captures.length; i++) {
        if (this.props.captures[i].status == "Pending") {
          captureAux.push(this.props.captures[i]);
        }
      }
    } else {
      captureAux = [...this.props.captures]
    }
    this.setState({ capturesToShow: captureAux, lastCaptures: this.props.captures, showOnlyPending: sop })
  }

  componentDidUpdate() {
    if(this.props.captures == this.state.lastCaptures)
      return
    var captureAux = []
    if(this.state.showOnlyPending) {
      for (var i = 0; i < this.props.captures.length; i++ ){
        if (this.props.captures[i].status == "Pending") {
          captureAux.push(this.props.captures[i]);
        }
      } 
    } else {
      captureAux = [...this.props.captures]
    }
    this.setState({capturesToShow: captureAux, lastCaptures: this.props.captures})
  }

  render(){
    if (this.props.captures){
      return (
        <div>
          <div>
            <Pagination
              activePage={this.state.activePage}
              itemsCountPerPage={10}
              totalItemsCount={this.state.capturesToShow.length}
              pageRangeDisplayed={9}
              onChange={this.handlePageChange}
            />
          </div>
          <label>
            
              <input type="checkbox" defaultChecked={this.state.showOnlyPending} id="showOnlyPending" ref="showOnlyPending" onChange={this.handleshowOnlyPending} />
            <span>Mostrar solo pendientes</span>
          </label>
          <div className="project-list section">
            {this.state.capturesToShow.map((capture, id) => {
              if ((10 * (this.state.activePage - 1)) <= id && id < (10 * this.state.activePage))
                  return (
                    <Link to={{pathname:'/capture/' + capture.id, state:capture}} key={capture.id}>
                      <CaptureSummary capture={capture} />
                    </Link>
                  )
            })}
          </div>
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
    return [
      { collection: 'capture', where: [['userId', '>=', props.filter]], orderBy: ['userId', 'asc'] }
    ]
  }),
)(CapturesList)