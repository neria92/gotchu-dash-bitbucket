import React, { Component } from 'react'
import UsersList from'../Users/UsersList'
import { connect} from 'react-redux'
import { firestoreConnect } from 'react-redux-firebase'
import {compose} from 'redux'
import {Redirect} from 'react-router-dom'
import { functions } from 'firebase'
import { signOut } from '../../store/actions/authActions'

class Users extends Component {

    handleSubmit = (e) => {
        e.preventDefault();

        const adminUID = document.querySelector('#admin-uid').value;
        const addAdminRole = functions().httpsCallable('addAdminRole');
        addAdminRole({ uid: adminUID }).then(result => {
            console.log(result);
        });
    }

    render(){
        
        const { users, auth, profile } = this.props;
        
        if(!auth.uid) return <Redirect to='/singin'></Redirect>
        if (!profile.isEmpty) {
            if(!profile.token.claims.admin){
                this.props.signOut();
            }
        }
        // auth.getIdTokenResult()
        //     .then((idTokenResult) => {
        //         // Confirm the user is an Admin.
        //         if (!!idTokenResult.claims.admin) {
        //             // Show admin UI.
        //             //showAdminUI();
        //             console.log("admin");
        //         } else {
        //             // Show regular user UI.
        //             // return <Redirect to='/singin'></Redirect>
        //             console.log("no admin");
        //         }
        //     })
        //     .catch((error) => {
        //         console.log(error);
        //     });
        //if(auth.uid) return <Redirect to='/create'></Redirect>
        return (
            <div className="dashboard container">
                <form onSubmit={this.handleSubmit} className="admin-actions" style={{ margin: "40px auto", backgroundColor: "white" }}>
                    <input placeholder="uid" id="admin-uid" required />
                    <button type="submit" value="Guardar" >Make admin</button>
                </form>
                <div className ="row">
                    <div className="col s12 m6">
                        <UsersList users={users}/>
                    </div>
                    {/* <div className="col s12 m5 offset-m1">
                        <Notifications />
                    </div> */}
                </div>
            </div>
        )
    }
}

// firebase.auth.onAuthStateChanged(user => {
//     if (user) {
//         console.log("si user");
//     }
// });

const mapDispatchToProps = (dispatch) => {
    return {
        signOut: () => dispatch(signOut())
    }
}

const mapStateToProps = (state) => {
    // if (!state.firebase.profile.isEmpty)
    // {
    //     console.log(state.firebase.profile.token.claims);
    // }
    console.log(state.firestore.ordered.users);
    return {
        users:  state.firestore.ordered.users,
        auth: state.firebase.auth,
        profile: state.firebase.profile
    }
}

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    firestoreConnect([
      { collection: 'users', orderBy: ['username', 'desc']}
    ])
  )(Users)
