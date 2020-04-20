import React from 'react'

const ChargeSummary = ({user}) => {
  return (
    <div className="card z-depth-0 project-summary">
      <div className="card-content grey-text text-darken-3">
        <span className="card-title ">{user.body.customer.name}</span>
        <p>{user.body.amount}</p>
      </div>
    </div>
  )
}

export default ChargeSummary