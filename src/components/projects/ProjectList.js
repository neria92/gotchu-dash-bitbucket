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
      originalList: null,
      orderedByReportsList: null
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
      // for (var i = 0; i < this.props.projects.length; i++) {
      //   if (this.props.projects[i].status == "Pending") {
      //     missionsAux.push(this.props.projects[i]);
      //   }
      // }
    } else {
      missionsAux = [...this.props.projects]
    }
    this.setState({ missionsToShow: missionsAux, lastMissions: this.props.captures, orderByReports: obr })
  }

  componentDidUpdate() {
    if (this.props.projects == this.state.lastMissions)
      return
    var missionsAux = []
    if (this.state.orderByReports) {
      if(originalList == null){
        originalList = this.props.projects;
        var auxlist = originalList;
        orderedByReportsList = auxlist.sort(function (a, b) {
          return a.reports - b.reports;
        });

      }

      missionsAux = orderedByReportsList;

      // for (var i = 0; i < this.props.projects.length; i++) {
      //   if (this.props.projects[i].status == "Pending") {
      //     missionsAux.push(this.props.projects[i]);
      //   }
      // }
    } else {
      missionsAux = [...this.props.projects]
    }
    this.setState({ missionsToShow: missionsAux, lastMissions: this.props.projects })
  }

  render() {
    if (this.props.projects) {
      console.log(this.props.projects.length)
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
            {this.state.missionsToShow.map((project,id) => {
            if ((10 * (this.state.activePage - 1)) <= id && id < (10 *this.state.activePage ))
            return (
              <Link to={{pathname:'/project/' + project.id, state:project}} key={project.id}>
                <ProjectSummary project={project} />
              </Link>
            );
          })}
        </div>
        </div>
      );
    } 
    else {
      return (
        <div className="container center">
          <p>Loading projects...</p>
        </div>
      )
    }
  }
}
  
const mapStateToProps = (state) => {
  return {
    projects: state.firestore.ordered.missions
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
    console.log(props.filter.charAt(0).toUpperCase() + props.filter.slice(1))
    return [
      {
        collection: 'missions', limit:0, where: [['title.es', '>=', props.filter.charAt(0).toUpperCase() + props.filter.slice(1)]], orderBy: ['title.es', 'asc'] }
    ]
  }),
)(ProjectList)