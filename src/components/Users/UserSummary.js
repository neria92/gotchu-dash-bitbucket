import React from 'react'

const UserSummary = ({project}) => {
  return (
    <div className="card z-depth-0 project-summary">
      <div className="card-content grey-text text-darken-3">
        <span className="card-title ">{project.title}</span>
        <p>Posted by {project.creator}</p>
      </div>
    </div>
  )
}

export default UserSummary