import React, { Component } from 'react'
import { connect } from 'react-redux'
import { firestoreConnect } from 'react-redux-firebase'
import { compose } from 'redux'
import PaymentSummary from './PaySummary'
import { Link } from 'react-router-dom'
import Pagination from "react-js-pagination";

class PaymentList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activePage: 1
    };
  }

  handlePageChange = (pageNumber) => {
    this.setState({ activePage: pageNumber });
  }

  render(){
    if (this.props.searching) {
      return (
        <div >
          <p style={{ color: "white" }}>Searching...</p>
        </div>
      )
    } else {
      if (this.props.users) {
        return (
          <div>
            <div>
              <Pagination
                activePage={this.state.activePage}
                itemsCountPerPage={10}
                totalItemsCount={this.props.users.length}
                pageRangeDisplayed={9}
                onChange={this.handlePageChange}
              />
            </div>
            <div className="project-list section">
              {this.props.users.map((user, id) => {
                if ((10 * (this.state.activePage - 1)) <= id && id < (10 * this.state.activePage))
                  return (
                      <PaymentSummary user={user} />
                  )
              })}
            </div>
          </div>
        )
      } else {
        return (
          <div >
            <p style={{ color: "white" }}>Loading users...</p>
          </div>
        )
      }
    }

    
  }
}

const mapStateToProps = (state) => {
  return {
    //users: state.firestore.ordered.users,
  }
}

export default compose(
  connect(mapStateToProps),
  
)(PaymentList)