import React, { Component } from 'react'
import Pagination from "react-js-pagination";

import { connect } from 'react-redux'
import { firestoreConnect } from 'react-redux-firebase'
import { compose } from 'redux'
import MicrotaskSummary from './MicrotaskSummary'
import { Link } from 'react-router-dom'
import { timingSafeEqual } from 'crypto';
import { importDeclaration } from '@babel/types';

class MicrotasksList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      activePage: 1,
      capturesToShow: [],
      lastCaptures: []
    };
  }

  handlePageChange = (pageNumber) => {
    this.setState({ activePage: pageNumber });
  }

  componentDidUpdate() {
    //console.log("Microtasks did update")

    if(this.props.projects){
      if (this.props.projects == this.state.lastCaptures)
        return
      var captureAux = []
      for (var i = 0; i < this.props.projects.length; i++) {
        if (this.props.projects[i].microtask > "") {
          captureAux.push(this.props.projects[i]);
        }
      }

      this.setState({ capturesToShow: captureAux, lastCaptures: this.props.projects })
    }
  }

  componentDidMount() {
    //console.log("Microtasks did mount")

    // if (this.props.projects == this.state.lastCaptures)
    //   return
    // var captureAux = []
    // for (var i = 0; i < this.props.projects.length; i++) {
    //   if (this.props.projects[i].microtask > "") {
    //     captureAux.push(this.props.projects[i]);
    //   }
    // }

    this.setState({ activePage: 1 })
  }


  render() {
    if (this.props.projects) {
      //console.log(this.props.projects.length)
      return (
        <div>
          <div>
            <Pagination
              activePage={this.state.activePage}
              itemsCountPerPage={10}
              totalItemsCount={this.state.capturesToShow.length}
              pageRangeDisplayed={7}
              onChange={this.handlePageChange}
            />
          </div>

          <div className="project-list section">
            {this.state.capturesToShow.map((project, id) => {
              if ((10 * (this.state.activePage - 1)) <= id && id < (10 * this.state.activePage))
                return (
                  <Link to={{ pathname: '/microtask/' + project.id, state: project }} key={project.id}>
                    <MicrotaskSummary project={project} />
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
    //console.log(props.filter.charAt(0).toUpperCase() + props.filter.slice(1))
    return [
      {
        collection: 'missions', limit: 100, where: [['title.es', '>=', props.filter.charAt(0).toUpperCase() + props.filter.slice(1)]], orderBy: ['title.es', 'asc']
      }
    ]
  }),
)(MicrotasksList)