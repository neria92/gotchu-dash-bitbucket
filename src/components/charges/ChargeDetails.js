import React, { Component } from 'react'
import { connect } from 'react-redux'
import { firestoreConnect } from 'react-redux-firebase'
import { compose } from 'redux'
import { Redirect } from 'react-router-dom'
import {editUser} from '../../store/actions/userActions'
import { functions } from 'firebase'

class PaymentDetails extends Component {

  state = {
    savingChanges: false,
    admin:false
  }

  componentDidMount() {
    //console.log(this.props.location.state)
  }

  handleChange = (e) => {
    this.setState({
      [e.target.id]: e.target.value
    })
  }

  handleAdmin = (e) => {
    e.preventDefault();
    const adminUID = this.props._id;
    const addAdminRole = functions().httpsCallable('addAdminRole');
    addAdminRole({ uid: adminUID }).then(result => {
      console.log(result);
      this.setState({admin:true})
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    console.log(this.props)
    const userID = this.props.id;

    const user = {
      username: this.refs.username.value,
      state: this.refs.state.value,
      points: parseInt(this.refs.points.value),
      avatarParts: [
        parseInt(this.refs.p0.value),
        parseInt(this.refs.p1.value),
        parseInt(this.refs.p2.value),
        parseInt(this.refs.p3.value),
        parseInt(this.refs.p4.value),
        parseInt(this.refs.p5.value),
        parseInt(this.refs.p6.value),
        parseInt(this.refs.p7.value),
        parseInt(this.refs.p8.value),
        parseInt(this.refs.p9.value),
         parseInt(this.refs.p10.value),
         parseInt(this.refs.p11.value),
         parseInt(this.refs.p12.value),
         parseInt(this.refs.p13.value),
      ],
      blocked: this.refs.blocked.checked,
    };
    this.setState({
      ...this.state,
      savingChanges: true
    })
    console.log(user);
    this.props.editUser({ userID, user });
  }
  
  render() {
    const { user, auth, userActions } = this.props;
    if (!auth.uid) return <Redirect to='/singin' /> 
    if (this.state.savingChanges && userActions.userSaved) {
      return <Redirect to='/users' />
    }
    if (this.props.location.state) {
      return (
        <div className="container section project-details">
          <div className="card z-depth-0">
            <div className="card-content">
              <form>
                <textarea defaultValue={JSON.stringify(this.props.location.state, null, 1)} rows="40" cols="50" style={{ height: "auto" }}/>
              </form>
            </div>
          </div>
        </div>
      )
    } else {
      return (
        <div className="container center">
          <p>Loading charge...</p>
        </div>
      )
    }
  }
}

const mapStateToProps = (state, ownProps) => {
  const id = ownProps.match.params.id;
  const users = state.firestore.data.payments;
  const user = users ? users[id] : null;

  return {
    id: id,
    user: user,
    auth: state.firebase.auth,
    userActions: state.userReducer
  }
}

const mapDispathToProps = (dispatch) => {
  return {
    editUser: (capture) => dispatch(editUser(capture))
  }
}

export default compose(
  connect(mapStateToProps, mapDispathToProps),
  firestoreConnect([{
    collection: 'charges'
  }])
)(PaymentDetails)