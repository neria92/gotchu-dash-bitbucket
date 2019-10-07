import React from 'react'
import UserSummary from './UserSummary'
import { Link } from 'react-router-dom'

const UsersList = ({users}) => {
    return (
      <div className="project-list section">
        { users && users.map(project => {
          return (
            <Link to={'/user/' + project.id} key={project.id}>
              <UserSummary project={project} />
            </Link>
          )
        })}  
      </div>
    )
  }
  

export default UsersList