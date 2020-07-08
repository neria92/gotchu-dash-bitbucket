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
    savingAdmin: false,
    admin:false
  }

  handleChange = (e) => {
    this.setState({
      [e.target.id]: e.target.value
    })
  }

  handleAdmin = (e) => {
    e.preventDefault();
    this.setState({ savingAdmin: true })
    console.log(this.props.id)
    const adminUID = this.props.id;
    const addAdminRole = functions().httpsCallable('addAdminRole');
    addAdminRole({ uid: adminUID }).then(result => {
      console.log(result);
      this.setState({admin:true})
      this.saveUserData()
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.saveUserData()
  }

  saveUserData(){
    //console.log(this.props)
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

    if(this.props.user.isAdmin){
      user.adminPermissions = {
        missions: this.refs.adminPermissionsMissions.checked,
        users: this.refs.adminPermissionsUsers.checked,
        captures: this.refs.adminPermissionsCaptures.checked,
        microtasks: this.refs.adminPermissionsMicrotasks.checked,
        pay: this.refs.adminPermissionsPay.checked,
        payments: this.refs.adminPermissionsPayments.checked,
        charges: this.refs.adminPermissionsCharges.checked,
        analytics: this.refs.adminPermissionsAnalytics.checked
      }
    } else {
      if (this.state.admin == true) {
        user.isAdmin = true
        user.adminPermissions = {
          missions:true,
          users:true,
          captures:true,
          microtasks:true,
          pay:true,
          payments:true,
          charges:true,
          analytics:true
        }
      }
    }
    
    this.setState({
      ...this.state,
      savingChanges: true
    })
    //console.log(user);
    this.props.editUser({ userID, user });
  }
  
  render() {
    const { user, auth, userActions } = this.props;
    //console.log(user);
    if (!auth.uid) return <Redirect to='/singin' /> 
    if (this.state.savingChanges && userActions.userSaved) {
      return <Redirect to='/users' />
    }
    if (user) {
      return (
        <div className="container section project-details">
          {this.state.savingAdmin && <button disabled={true} className="btn waves-effect waves-light" onClick={this.handleAdmin}>Guardando...</button>}
          {!this.state.savingAdmin && <button className="btn waves-effect waves-light" onClick={this.handleAdmin}>Asignar Administrador</button>}
          <div className="card z-depth-0">
            <div className="card-content">
              <form onSubmit={this.handleSubmit}>
                <label>
                  Username:
                <input defaultValue={user.username} ref="username" onChange={this.handleChange} />
                </label>
                <label>
                  State:
                <input defaultValue={user.state} ref="state" onChange={this.handleChange} />
                </label>
                <label>
                  Points:
                <input defaultValue={user.points} ref="points" onChange={this.handleChange} />
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
                <label>
                  Pieze 6:
                <input defaultValue={user.avatarParts[6]} ref="p6" onChange={this.handleChange} />
                </label>
                <label>
                  Pieze 7:
                <input defaultValue={user.avatarParts[7]} ref="p7" onChange={this.handleChange} />
                </label>
                <label>
                  Pieze 8:
                <input defaultValue={user.avatarParts[8]} ref="p8" onChange={this.handleChange} />
                </label>
                <label>
                  Pieze 9:
                <input defaultValue={user.avatarParts[9]} ref="p9" onChange={this.handleChange} />
                </label>
                <label>
                  Pieze 10:
                <input defaultValue={user.avatarParts[10]} ref="p10" onChange={this.handleChange} />
                </label>
                <label>
                  Pieze 11:
                <input defaultValue={user.avatarParts[11]} ref="p11" onChange={this.handleChange} />
                </label>
                <label>
                  Pieze 12:
                <input defaultValue={user.avatarParts[12]} ref="p12" onChange={this.handleChange} />
                </label>
                <label>
                  Pieze 13:
                <input defaultValue={user.avatarParts[13]} ref="p13" onChange={this.handleChange} />
                </label>
                <p>
                  <label>
                    <input type="checkbox" defaultChecked={user.blocked!=null?user.blocked:false} id="blocked" ref="blocked" onChange={this.handleChange} />
                    <span>Bloqueado</span>
                  </label>
                </p>

                {user.isAdmin &&
                <div>
                  <h5 >Permisos de administrador</h5>

                  <p>
                    <label>
                    <input type="checkbox" defaultChecked={user.adminPermissions.missions != null ? user.adminPermissions.missions : false} id="adminPermissionsMissions" ref="adminPermissionsMissions" onChange={this.handleChange} />
                      <span>Missions</span>
                    </label>
                  </p>

                  <p>
                    <label>
                      <input type="checkbox" defaultChecked={user.adminPermissions.users != null ? user.adminPermissions.users : false} id="adminPermissionsUsers" ref="adminPermissionsUsers" onChange={this.handleChange} />
                      <span>Users</span>
                    </label>
                  </p>

                  <p>
                    <label>
                      <input type="checkbox" defaultChecked={user.adminPermissions.captures != null ? user.adminPermissions.captures : false} id="adminPermissionsCaptures" ref="adminPermissionsCaptures" onChange={this.handleChange} />
                      <span>Captures</span>
                    </label>
                  </p>

                  <p>
                    <label>
                      <input type="checkbox" defaultChecked={user.adminPermissions.microtasks != null ? user.adminPermissions.microtasks : false} id="adminPermissionsMicrotasks" ref="adminPermissionsMicrotasks" onChange={this.handleChange} />
                      <span>Microtasks</span>
                    </label>
                  </p>

                  <p>
                    <label>
                      <input type="checkbox" defaultChecked={user.adminPermissions.pay != null ? user.adminPermissions.pay : false} id="adminPermissionsPay" ref="adminPermissionsPay" onChange={this.handleChange} />
                      <span>Pay</span>
                    </label>
                  </p>

                  <p>
                    <label>
                      <input type="checkbox" defaultChecked={user.adminPermissions.payments != null ? user.adminPermissions.payments : false} id="adminPermissionsPayments" ref="adminPermissionsPayments" onChange={this.handleChange} />
                      <span>Payments</span>
                    </label>
                  </p>

                  <p>
                    <label>
                      <input type="checkbox" defaultChecked={user.adminPermissions.charges != null ? user.adminPermissions.charges : false} id="adminPermissionsCharges" ref="adminPermissionsCharges" onChange={this.handleChange} />
                      <span>Charges</span>
                    </label>
                  </p>

                  <p>
                    <label>
                      <input type="checkbox" defaultChecked={user.adminPermissions.analytics != null ? user.adminPermissions.analytics : false} id="adminPermissionsAnalytics" ref="adminPermissionsAnalytics" onChange={this.handleChange} />
                      <span>Analytics</span>
                    </label>
                  </p>
                </div>
                }

                {this.state.admin &&
                 <label>
                 Usuario es Administrador!
                </label>
               }
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
  //console.log(ownProps.match.params.id)
  //console.log(users)

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