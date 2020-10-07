import React from 'react'

const ChargeSummary = ({user}) => {
  var bodystrg = "null"
  var amountstrg = "null"
  if (user.body !== null && user.body.customer !== null && user.body.customer.name !== null )
    bodystrg = user.body.customer.name

  if (user.body !== null && user.body.amount !== null )
    amountstrg = user.body.amount
  return (
    <div className="card z-depth-0 project-summary">
      <div className="card-content grey-text text-darken-3">
        <span className="card-title ">{bodystrg}</span>
        <p>{amountstrg}</p>
      </div>
    </div>
  )
}

export default ChargeSummary