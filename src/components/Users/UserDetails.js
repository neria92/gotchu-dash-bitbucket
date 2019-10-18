import React, { Component } from 'react'
import { connect } from 'react-redux'
import { firestoreConnect } from 'react-redux-firebase'
import { compose } from 'redux'
import { Redirect } from 'react-router-dom'
import {editUser} from '../../store/actions/userActions'
import { functions } from 'firebase'

class UserDetails extends Component {

  state = {
    savingChanges: false,
    admin:false
  }

  handleChange = (e) => {
    this.setState({
      [e.target.id]: e.target.value
    })
  }

  handleAdmin = (e) => {
    e.preventDefault();
    const adminUID = this.props.id;
    const addAdminRole = functions().httpsCallable('addAdminRole');
    addAdminRole({ uid: adminUID }).then(result => {
      console.log(result);
      this.setState({admin:true})
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const userID = this.props.id;

    const user = {
      username: this.refs.username.value,
      p0: parseInt(this.refs.p0.value),
      p1: parseInt(this.refs.p1.value),
      p2: parseInt(this.refs.p2.value),
      p3: parseInt(this.refs.p3.value),
      p4: parseInt(this.refs.p4.value),
      p5: parseInt(this.refs.p5.value),
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
    if (user) {
      return (
        <div className="container section project-details">
          <button className="btn waves-effect waves-light" onClick={this.handleAdmin}>Asignar Administrador</button>
          <div className="card z-depth-0">
            <div className="card-content">
              <form onSubmit={this.handleSubmit}>
                <label>
                  Username:
                <input defaultValue={user.username} ref="username" onChange={this.handleChange} />
                </label>
                <label>
                  Pieze 0:
                <input defaultValue={user.avatarParts[0]} ref="p0" onChange={this.handleChange} />
                </label>
                <label>
                  Pieze 1:
                <input defaultValue={user.avatarParts[1]} ref="p1" onChange={this.handleChange} />
                </label>
                <label>
                  Pieze 2:
                <input defaultValue={user.avatarParts[2]} ref="p2" onChange={this.handleChange} />
                </label>
                <label>
                  Pieze 3:
                <input defaultValue={user.avatarParts[3]} ref="p3" onChange={this.handleChange} />
                </label>
                <label>
                  Pieze 4:
                <input defaultValue={user.avatarParts[4]} ref="p4" onChange={this.handleChange} />
                </label>
                <label>
                  Pieze 5:
                <input defaultValue={user.avatarParts[5]} ref="p5" onChange={this.handleChange} />
                </label>
                <p>
                  <label>
                    <input type="checkbox" defaultChecked={user.blocked!=null?user.blocked:false} id="blocked" ref="blocked" onChange={this.handleChange} />
                    <span>Bloqueado</span>
                  </label>
                </p>
                {this.state.admin &&
                 <label>
                 Usuario es Administrador!
               </label>}
                <button className="btn waves-effect waves-light" type="submit" name="action">Guardar</button>
              </form>
            </div>
          </div>
        </div>
      )
    } else {
      return (
        <div className="container center">
          <p>Loading user...</p>
        </div>
      )
    }
  }
}

const mapStateToProps = (state, ownProps) => {
  const id = ownProps.match.params.id;
  const users = state.firestore.data.users;
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
    collection: 'users'
  }])
)(UserDetails)