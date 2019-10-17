import React, { Component } from 'react'
import { connect } from 'react-redux'
import { firestoreConnect } from 'react-redux-firebase'
import { compose } from 'redux'
import UserSummary from './UserSummary'
import { Link } from 'react-router-dom'

class UsersList extends Component {
  render(){
    if(this.props.users){
      return (
        <div className="project-list section">
          {this.props.users.map(user => {
            return (
              <Link to={'/user/' + user.id} key={user.id}>
                <UserSummary user={user} />
              </Link>
            )
          })}
        </div>
      )
    } else {
      return (
        <div className="container center">
          <p>Loading users...</p>
        </div>
      )
    }
  }
}

const mapStateToProps = (state) => {
  return {
    users: state.firestore.ordered.users,
  }
}

export default compose(
  connect(mapStateToProps),
  firestoreConnect(props => {
    //console.log(props.filter.charAt(0).toUpperCase() + props.filter.slice(1))
    return [
      { collection: 'users', where: [['username', '>=', props.filter]], orderBy: ['username', 'asc'] }
    ]
  }),
)(UsersList)