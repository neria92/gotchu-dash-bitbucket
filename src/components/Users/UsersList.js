import React from 'react'
import UserSummary from './UserSummary'
import { Link } from 'react-router-dom'

const UsersList = ({users}) => {
    return (
      <div className="project-list section">
        { users && users.map(user => {
          return (
            <Link to={'/user/' + user.id} key={user.id}>
              <UserSummary user={user} />
            </Link>
          )
        })}  
      </div>
    )
  }
  

export default UsersList