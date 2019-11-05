import React from 'react'

const CaptureSummary = ({capture}) => {
  return (
    <div className="card z-depth-0 project-summary">
      <div className="card-content grey-text text-darken-3">
        <span className="card-title ">{capture.mission}</span>
        <span className="card-title ">{capture.userId}</span>
        {/* <p>Posted by {user.creator}</p> */}
      </div>
    </div>
  )
}

export default CaptureSummary