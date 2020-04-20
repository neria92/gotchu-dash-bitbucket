import React, { Component } from 'react'
import { connect } from 'react-redux'
import { firestoreConnect } from 'react-redux-firebase'
import { compose } from 'redux'
import PaymentSummary from './PaymentsSummary'
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
      if (this.props.payments) {
        return (
          <div>
            <div>
              <Pagination
                activePage={this.state.activePage}
                itemsCountPerPage={10}
                totalItemsCount={this.props.payments.length}
                pageRangeDisplayed={9}
                onChange={this.handlePageChange}
              />
            </div>
            <div className="project-list section">
              {this.props.payments.map((user, id) => {
                if ((10 * (this.state.activePage - 1)) <= id && id < (10 * this.state.activePage))
                  return (
                    <Link to={{pathname: '/payment/' + user.id, state: user}} key={user.id}>
                      <PaymentSummary user={user} />
                    </Link>
                  )
              })}
            </div>
          </div>
        )
      } else {
        return (
          <div >
            <p style={{ color: "white" }}>Loading payments...</p>
          </div>
        )
      }
    }
  }
}

const mapStateToProps = (state) => {
  return {
    payments: state.firestore.ordered.payments,
  }
}

export default compose(
  connect(mapStateToProps),
  firestoreConnect(props => {
    //console.log(props.filter)
    if(props.filter === ''){
      return [
        { collection: 'payments' }
      ]
    } else {
      return [
        { collection: 'payments', where: [['uid', '==', props.filter]] }
      ]
    }
  }),
)(PaymentList)