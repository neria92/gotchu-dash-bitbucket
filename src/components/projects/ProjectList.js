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
      activePage: 1
    };
  }


  handlePageChange = (pageNumber) => {
    console.log(`active page is ${pageNumber}`);
    this.setState({ activePage: pageNumber });
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
              totalItemsCount={this.props.projects.length}
            pageRangeDisplayed={9}
            onChange={this.handlePageChange}
          />
        </div>

        <div className="project-list section">
          {this.props.projects.map((project,id) => {
            if ((10 * (this.state.activePage - 1)) <= id && id < (10 *this.state.activePage ))
            return (
              <Link to={'/project/' + project.id} key={project.id}>
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