import React, { Component } from 'react'
import { connect } from 'react-redux'
import { firestoreConnect } from 'react-redux-firebase'
import { compose } from 'redux'
import CaptureSummary from './CaptureSummary'
import { Link } from 'react-router-dom'
import Pagination from "react-js-pagination";
import { showOnlyPending, orderByReports, showOnlyAccepted, showOnlyRejected } from '../../store/actions/captureActions'

class CapturesList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activePage: 1,
      showOnlyPending: false,
      capturesToShow: [], 
      lastCaptures: [],
      originalList: null,
      orderedByReportsList: null,
      orderByReports: false,
      showOnlyAccepted: false,
      showOnlyRejected: false
    };
  }

  handlePageChange = (pageNumber) => {
    this.setState({ activePage: pageNumber });
  }

  componentDidMount() {
    this.setState({ showOnlyPending: this.props.showOnlyPending })
    this.setState({ orderByReports: this.props.orderByReports })
    this.setState({ showOnlyAccepted: this.props.showOnlyAccepted })
    this.setState({ showOnlyRejected: this.props.showOnlyRejected })

    if (this.props.captures == this.state.lastCaptures)
      return
    var captureAux = []
    if (this.refs.showOnlyPending && this.refs.showOnlyPending.checked && this.props.captures) {
      for (var i = 0; i < this.props.captures.length; i++) {
        if (this.props.captures[i].status == "Pending") {
          captureAux.push(this.props.captures[i]);
        }
      }
    } else {
      if (this.props.captures) {
        captureAux = [...this.props.captures]
      }
    }
    console.log("captures ordenadas en mount")
    this.setState({ capturesToShow: captureAux, lastCaptures: this.props.captures })
  }

  handleshowOnlyPending = (e) => {
    this.disableHandleOrderByReports();
    this.disableShowOnlyAccepted();
    this.disableShowOnlyRejected();

    var sop = false
    if (this.refs.showOnlyPending && this.refs.showOnlyPending.checked)
      sop = true
    var captureAux = []
    if (sop) {
      for (var i = 0; i < this.props.captures.length; i++) {
        if (this.props.captures[i].status == "Pending") {
          captureAux.push(this.props.captures[i]);
        }
      }
    } else {
      if(this.props.captures)
      captureAux = [...this.props.captures]
    }
    this.props.setShowOnlyPending(sop)
    this.setState({ capturesToShow: captureAux, lastCaptures: this.props.captures, showOnlyPending: this.props.showOnlyPending })
  }

  disableShowOnlyPending() {
    this.refs.showOnlyPending.checked = false;
    this.setState({ showOnlyPending: false })
    this.props.setShowOnlyPending(false)
  }

  handleShowOnlyAccepted = (e) => {
    this.disableHandleOrderByReports();
    this.disableShowOnlyPending();
    this.disableShowOnlyRejected();

    var soa = false
    if (this.refs.showOnlyAccepted && this.refs.showOnlyAccepted.checked )
      soa = true
    var captureAux = []
    if (soa) {
      for (var i = 0; i < this.props.captures.length; i++) {
        if (this.props.captures[i].status == "Accepted") {
          captureAux.push(this.props.captures[i]);
        }
      }
    } else {
      if (this.props.captures)
      captureAux = [...this.props.captures]
    }
    this.props.setShowOnlyAccepted(soa)
    this.setState({ capturesToShow: captureAux, lastCaptures: this.props.captures, showOnlyAccepted: this.props.showOnlyAccepted })
  }

  disableShowOnlyAccepted() {
    this.refs.showOnlyAccepted.checked = false;
    this.setState({ showOnlyAccepted: false })
    this.props.setShowOnlyAccepted(false)
  }

  handleShowOnlyRejected = (e) => {
    this.disableHandleOrderByReports();
    this.disableShowOnlyPending();
    this.disableShowOnlyAccepted();

    var sor = false
    if (this.refs.showOnlyRejected && this.refs.showOnlyRejected.checked)
      sor = true
    var captureAux = []
    if (sor) {
      for (var i = 0; i < this.props.captures.length; i++) {
        if (this.props.captures[i].status == "Rejected") {
          captureAux.push(this.props.captures[i]);
        }
      }
    } else {
      if (this.props.captures)
        captureAux = [...this.props.captures]
    }
    this.props.setShowOnlyRejected(sor)
    this.setState({ capturesToShow: captureAux, lastCaptures: this.props.captures, showOnlyRejected: this.props.showOnlyRejected })
  }

  disableShowOnlyRejected() {
    this.refs.showOnlyRejected.checked = false;
    this.setState({ showOnlyRejected: false })
    this.props.setShowOnlyRejected(false)
  }

  handleorderByReports = (e) => {
    this.disableShowOnlyAccepted();
    this.disableShowOnlyPending();
    this.disableShowOnlyRejected();

    var obr = false
    if (this.refs.orderByReports && this.refs.orderByReports.checked)
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
      if (this.props.captures)
      captureAux = [...this.props.captures]
    }
    this.props.setOrderByReports(obr)
    this.setState({ capturesToShow: captureAux, lastCaptures: this.props.captures, orderByReports: obr })
  }

  disableHandleOrderByReports() {
    this.refs.orderByReports.checked = false;
    this.setState({ orderByReports: false })
    this.props.setOrderByReports(false)
  }

  componentDidUpdate() {
    if(this.props.captures == this.state.lastCaptures)
      return
    var captureAux = [...this.props.captures]

    //order by reports
    if (this.state.orderByReports && this.props.captures) {
      captureAux = [...this.props.captures]
      captureAux.sort(function (a, b) {
        if (a.reports != null && b.reports != null) {
          return b.reports - a.reports;
        } else {
          return a.reports != null ? -1 : 1;
        }
      });
    } 
    
    //show only pending
    if (this.state.showOnlyPending && this.props.captures) {
      captureAux = []
      for (var i = 0; i < this.props.captures.length; i++ ){
        if (this.props.captures[i].status == "Pending") {
          captureAux.push(this.props.captures[i]);
        }
      } 
    } 

    //show only accepted
    if (this.state.showOnlyAccepted && this.props.captures) {
      captureAux = []
      for (var i = 0; i < this.props.captures.length; i++) {
        if (this.props.captures[i].status == "Accepted") {
          captureAux.push(this.props.captures[i]);
        }
      }
    }

    //show only rejected
    if (this.state.showOnlyRejected && this.props.showOnlyRejected) {
      captureAux = []
      for (var i = 0; i < this.props.captures.length; i++) {
        if (this.props.captures[i].status == "Rejected") {
          captureAux.push(this.props.captures[i]);
        }
      }
    }

    this.setState({ capturesToShow: captureAux, lastCaptures: this.props.captures })
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
            <label>

              <input type="checkbox" defaultChecked={this.state.showOnlyAccepted} id="showOnlyAccepted" ref="showOnlyAccepted" onChange={this.handleShowOnlyAccepted} />
              <span>Mostrar solo aceptadas</span>
            </label>
            <label>

              <input type="checkbox" defaultChecked={this.state.showOnlyRejected} id="showOnlyRejected" ref="showOnlyRejected" onChange={this.handleShowOnlyRejected} />
              <span>Mostrar solo rechazadas</span>
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
    setShowOnlyPending: (sop) => dispatch(showOnlyPending(sop)),
    setOrderByReports: (obr) => dispatch(orderByReports(obr)),
    setShowOnlyAccepted: (soa) => dispatch(showOnlyAccepted(soa)),
    setShowOnlyRejected: (sor) => dispatch(showOnlyRejected(sor)),
  }
}

const mapStateToProps = (state) => {
  return {
    //captures: state.firestore.ordered.capture,
    showOnlyPending: state.captureReducer.showOnlyPending,
    orderByReports: state.captureReducer.orderByReports,
    showOnlyAccepted: state.captureReducer.showOnlyAccepted,
    showOnlyRejected: state.captureReducer.showOnlyRejected
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