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

    };
  }

  handlePageChange = (pageNumber) => {
    this.setState({ activePage: pageNumber });
  }

  handleshowOnlyPending = (e) => {
    var sop = false
    if (this.refs.showOnlyPending.checked)
      sop = true

    this.setState({ showOnlyPending: sop})
  }

  render(){
    if (this.props.captures){
      return (
        <div>
          <div>
            <Pagination
              activePage={this.state.activePage}
              itemsCountPerPage={10}
              totalItemsCount={this.props.captures.length}
              pageRangeDisplayed={9}
              onChange={this.handlePageChange}
            />
          </div>
          <label>
            
              <input type="checkbox" defaultChecked={this.state.showOnlyPending} id="showOnlyPending" ref="showOnlyPending" onChange={this.handleshowOnlyPending} />
            <span>Mostrar solo pendientes</span>
          </label>
          <div className="project-list section">
            {this.props.captures.map((capture, id) => {
              if ((10 * (this.state.activePage - 1)) <= id && id < (10 * this.state.activePage))
                if(!this.state.showOnlyPending)
                  return (
                    <Link to={{pathname:'/capture/' + capture.id, state:capture}} key={capture.id}>
                      <CaptureSummary capture={capture} />
                    </Link>
                  )
                else if (capture.status == "Pending")
                  return (
                    <Link to={{ pathname: '/capture/' + capture.id, state: capture }} key={capture.id}>
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
    //console.log(props.filter.charAt(0).toUpperCase() + props.filter.slice(1))
    return [
      { collection: 'capture', where: [['userId', '>=', props.filter]], orderBy: ['userId', 'asc'] }
    ]
  }),
)(CapturesList)