import React, { Component } from 'react'
import Notifications from './Notifications'
import ProjectList from'../projects/ProjectList'
import { connect} from 'react-redux'
import { firestoreConnect } from 'react-redux-firebase'
import {compose} from 'redux'
import {Redirect} from 'react-router-dom'
import {functions} from 'firebase'

class Dashboard extends Component {

    handleSubmit = (e) => {
        e.preventDefault();
        const adminUID = document.querySelector('#admin-uid').value;
        const addAdminRole = functions().httpsCallable('addAdminRole');
        addAdminRole({ uid: adminUID }).then(result => {
            console.log(result);
        });
    }

    render(){
        
        const { projects, auth, notifications } = this.props;
        
        if(!auth.uid) return <Redirect to='/singin'></Redirect>
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
                        <ProjectList projects={projects}/>
                    </div>
                    <div className="col s12 m5 offset-m1">
                        <Notifications />
                    </div>
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

const mapStateToProps = (state) => {
    console.log(state.firebase.profile.token);
    
    return {
        projects:  state.firestore.ordered.missions,
        auth: state.firebase.auth,
    }
}

export default compose(
    connect(mapStateToProps),
    firestoreConnect([
      { collection: 'missions', orderBy: ['title', 'desc']}
    ])
  )(Dashboard)