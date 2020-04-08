import React, { Component } from 'react'
import Pagination from "react-js-pagination";

import { connect } from 'react-redux'
import { firestoreConnect } from 'react-redux-firebase'
import { compose } from 'redux'
import ProjectSummary from './ProjectSummary'
import { Link } from 'react-router-dom'
import { timingSafeEqual } from 'crypto';
import { importDeclaration } from '@babel/types';

class ProjectList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      activePage: 1,
      orderByReports: false,
      missionsToShow: [],
      lastMissions: [],
    };
  }

  handlePageChange = (pageNumber) => {
    this.setState({ activePage: pageNumber });
  }

  handleorderByReports = (e) => {
    var obr = false
    if (this.refs.orderByReports.checked)
      obr = true
    var missionsAux = []
    if (obr) {
      missionsAux = [...this.props.projects];
      missionsAux.sort(function (a, b) {
        if(a.reports != null && b.reports !=null ){
          return b.reports - a.reports;
        } else {
          return a.reports != null ? -1 : 1 ;
        }
      });
      // for (var i = 0; i < this.props.projects.length; i++) {
      //   if (this.props.projects[i].status == "Pending") {
      //     missionsAux.push(this.props.projects[i]);
      //   }
      // }
    } else {
      missionsAux = [...this.props.projects]
    }
    this.setState({ missionsToShow: missionsAux, lastMissions: this.props.projects, orderByReports: obr })
  }

  componentDidUpdate() {
    if (this.props.projects == this.state.lastMissions)
      return
    var missionsAux = []
    var originalListAux = []
    var o = []
    if (this.state.orderByReports) {
      missionsAux = [...this.props.projects];
      missionsAux.sort(function (a, b) {
        if (a.reports != null && b.reports != null) {
          return b.reports - a.reports;
        } else {
          return a.reports != null ? -1 : 1;
        }
      });

      // for (var i = 0; i < this.props.projects.length; i++) {
      //   if (this.props.projects[i].status == "Pending") {
      //     missionsAux.push(this.props.projects[i]);
      //   }
      // }
    } else if (this.props.projects){
      missionsAux = [...this.props.projects]
    }
    this.setState({ missionsToShow: missionsAux, lastMissions: this.props.projects })
  }

  render() {
    if (this.props.searching) {
      return (
        <div >
          <p style={{ color: "white" }}>Searching...</p>
        </div>
      )
    } else {
      if (this.props.projects) {
        return (
          <div>
            <div>
              <Pagination
                activePage={this.state.activePage}
                itemsCountPerPage={10}
                totalItemsCount={this.state.missionsToShow.length}
                pageRangeDisplayed={7}
                onChange={this.handlePageChange}
              />
            </div>
            <label>

              <input type="checkbox" defaultChecked={this.state.orderByReports} id="orderByReports" ref="orderByReports" onChange={this.handleorderByReports} />
              <span>Ordernar por cantidad de reportes</span>
            </label>
            <div className="project-list section">
              {this.state.missionsToShow.map((project, id) => {
                if ((10 * (this.state.activePage - 1)) <= id && id < (10 * this.state.activePage))
                  return (
                    <Link to={{ pathname: '/project/' + project._id, state: project }} key={project._id}>
                      <ProjectSummary project={project} />
                    </Link>
                  );
              })}
            </div>
          </div>
        );
      } else {
        return (
          <div >
            <p style={{ color: "white" }}>Loading projects...</p>
          </div>
        )
      }
    
    } 
  }
}
  
const mapStateToProps = (state) => {
  return {
    //projects: state.firestore.ordered.missions
  }
}

const mapDispathToProps = (dispatch) => {
  return {
  }
}

// export default compose(
//   firebaseConnect(props => [
//     // uid comes from props
//     {
//       collection: 'missions',
//       queryParams: ['orderByChild=uid', `equalTo=${props.filter}`]
//     }
//   ]),
//   connect(mapStateToProps),
// )(ProjectList)

export default compose(
  connect(mapStateToProps, mapDispathToProps),
  firestoreConnect(props => {
    //console.log(props.filter.charAt(0).toUpperCase() + props.filter.slice(1))
    return [
      {
        collection: 'missions', limit:0, orderBy: ['title.es', 'asc'] }
    ]
  }),
)(ProjectList)