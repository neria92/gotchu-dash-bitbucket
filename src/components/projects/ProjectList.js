import React, { Component } from 'react'
import { connect } from 'react-redux'
import { firestoreConnect } from 'react-redux-firebase'
import { compose } from 'redux'
import ProjectSummary from './ProjectSummary'
import { Link } from 'react-router-dom'

class ProjectList extends Component {
  render() {
    if(this.props.projects){
      return (
        <div className="project-list section">
          {this.props.projects.map(project => {
            return (
              <Link to={{pathname:'/project/' + project.id, state:project}} key={project.id}>
                <ProjectSummary project={project} />
              </Link>
            )
          })}
        </div>
      )
    } else {
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
    projects: state.firestore.ordered.missions,
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
  connect(mapStateToProps),
  firestoreConnect(props => {
    console.log(props.filter.charAt(0).toUpperCase() + props.filter.slice(1))
    return [
      { collection: 'missions', where: [['title.es', '>=', props.filter.charAt(0).toUpperCase() + props.filter.slice(1)]], orderBy: ['title.es', 'asc'] }
    ]
  }),
)(ProjectList)