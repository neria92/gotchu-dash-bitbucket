import React from 'react'

const UserSummary = ({user}) => {
  return (
    <div className="card z-depth-0 project-summary">
      <div className="card-content grey-text text-darken-3">
        <span className="card-title ">{user.username}</span>
        {/* <p>Posted by {user.creator}</p> */}
      </div>
    </div>
  )
}

export default UserSummary