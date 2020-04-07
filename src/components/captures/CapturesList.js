import React, { Component } from 'react'
import { connect } from 'react-redux'
import { firestoreConnect } from 'react-redux-firebase'
import { compose } from 'redux'
import CaptureSummary from './CaptureSummary'
import { Link } from 'react-router-dom'
import Pagination from "react-js-pagination";
import { showOnlyPending } from '../../store/actions/captureActions'

class CapturesList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activePage: 1,
      showOnlyPending: false,
      capturesToShow: [], 
      lastCaptures: [],
      originalList: null,
      orderedByReportsList: null
    };
  }

  handlePageChange = (pageNumber) => {
    this.setState({ activePage: pageNumber });
  }

  componentDidMount() {
    this.setState({ showOnlyPending: this.props.showOnlyPending })
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
    this.props.setShowOnlyPending(sop)
    this.setState({ capturesToShow: captureAux, lastCaptures: this.props.captures, showOnlyPending: this.props.showOnlyPending })
  }

  handleorderByReports = (e) => {
    var obr = false
    if (this.refs.orderByReports.checked)
      obr = true
    var captureAux = []
    if (obr) {
      captureAux = [...this.props.captures];
      captureAux.sort(function (a, b) {
        if (a.reports != null && b.reports != null) {
          return b.reports - a.reports;
        } else {
          return a.reports != null ? -1 : 1;
        }
      });
      
    } else {
      captureAux = [...this.props.captures]
    }
    this.setState({ capturesToShow: captureAux, lastCaptures: this.props.captures, orderByReports: obr })
  }

  componentDidUpdate() {
    console.log(this.state.showOnlyPending)
    if(this.props.captures == this.state.lastCaptures)
      return
    var captureAux = []
    if(this.state.showOnlyPending && this.props.captures) {
      for (var i = 0; i < this.props.captures.length; i++ ){
        if (this.props.captures[i].status == "Pending") {
          captureAux.push(this.props.captures[i]);
        }
      } 
    } else {
      if (this.props.captures){
        captureAux = [...this.props.captures]
      }
    }
    this.setState({capturesToShow: captureAux, lastCaptures: this.props.captures})



    if (this.props.captures == this.state.lastMissions)
      return
    var captureAux = []
    if (this.state.orderByReports) {
      captureAux = [...this.props.captures];
      captureAux.sort(function (a, b) {
        if (a.reports != null && b.reports != null) {
          return b.reports - a.reports;
        } else {
          return a.reports != null ? -1 : 1;
        }
      });
    } else {
      captureAux = [...this.props.captures]
    }
    this.setState({ missionsToShow: captureAux, lastMissions: this.props.captures })
  }

  render(){
    if (this.props.searching) {
      return (
        <div >
          <p style={{ color: "white" }}>Searching...</p>
        </div>
      )
    } else {
      if (this.props.captures) {
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

              <input type="checkbox" defaultChecked={this.state.orderByReports} id="orderByReports" ref="orderByReports" onChange={this.handleorderByReports} />
              <span>Ordernar por cantidad de reportes</span>
            </label>
            <label>

              <input type="checkbox" defaultChecked={this.state.showOnlyPending} id="showOnlyPending" ref="showOnlyPending" onChange={this.handleshowOnlyPending} />
              <span>Mostrar solo pendientes</span>
            </label>
            <div className="project-list section">
              {this.state.capturesToShow.map((capture, id) => {
                if ((10 * (this.state.activePage - 1)) <= id && id < (10 * this.state.activePage))
                  return (
                    <Link to={{ pathname: '/capture/' + capture._id, state: capture }} key={capture._id}>
                      <CaptureSummary capture={capture} />
                    </Link>
                  )
              })}
            </div>
          </div>
        )
      } else {
        return (
          <div >
            <p style={{ color: "white" }}>Loading captures...</p>
          </div>
        )
      }
    }
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setShowOnlyPending: (sop) => dispatch(showOnlyPending(sop))
  }
}

const mapStateToProps = (state) => {
  return {
    //captures: state.firestore.ordered.capture,
    showOnlyPending: state.captureReducer.showOnlyPending
  }
}

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  firestoreConnect(props => {
    return [
      { collection: 'capture', orderBy: ['userId', 'asc'] }
    ]
  }),
)(CapturesList)