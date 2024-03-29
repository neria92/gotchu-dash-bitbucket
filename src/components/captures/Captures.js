import React, { Component } from 'react'
import CapturesList from'../captures/CapturesList'
import { connect} from 'react-redux'
import { firestoreConnect } from 'react-redux-firebase'
import {compose} from 'redux'
import {Redirect} from 'react-router-dom'
import { signOut } from '../../store/actions/authActions'
import { loadLoggedUserData } from '../../store/actions/userActions'
import { cloudFunctionsURL } from '../config/fbConfig'

class Captures extends Component {
    state = {
        projectsLoaded: false,
        busqueda: "",
        capturesBusqueda: null,
        searching: false
    };

    handleChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        })
    }

    handleSubmitSearch = (e) => {
        e.preventDefault();
        this.setState({ searching: true })
        if (this.state.busqueda === ""){
            this.getSearchResults(true);
        } else {
            this.getSearchResults(false);
        }
    }

    componentDidMount() {
        if (this.props.auth && !this.props.user) {
            this.props.loadLoggedUserData(this.props.auth.uid)
        }
        this.setState({
            busqueda: ''
        })
        this.getSearchResults(true);
    }

    getSearchResults(getAll) {

        // const dashboardSearch = functions().httpsCallable('dashboardSearch');
        // dashboardSearch({
        //         UID: "0",
        //         startIndex: 0,
        //         numberOfFeeds: 500,
        //         sortBy: "date",
        //         filter: { contentType: { missions: true, captures: false, users: false, hashtags: false }, whiteKeywords: [this.state.busqueda]}
        //     }).then(result => {
        //     console.log(result);
        //     //this.setState({ admin: true })
        // });
        console.log(this.state.busqueda)
        var fr = getAll ? { contentType: { missions: false, captures: true, users: false, hashtags: false }, "NSFW": true } : { contentType: { missions: false, captures: true, users: false, hashtags: false }, "NSFW": true, whiteMIDs: [this.state.busqueda] }
        fetch(cloudFunctionsURL + "/dashboardSearch", {
            method: 'POST',
            mode: 'cors',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                UID: "0",
                startIndex: 0,
                numberOfFeeds: 100,
                sortBy: "date",
                filter: fr
            }),
        }).then(response => {
            const statusCode = response.status;
            const data = response.json();
            return Promise.all([statusCode, data]);
        })
            .then(res => {
                if (res[0] == 200) {
                    // Hacer algo con lo que regresa el server = res[1].newsfeed
                    this.setState({
                        ...this.state,
                        searching: false,
                        capturesBusqueda: res[1].result
                    })
                    //console.log(res[1].result);

                } else {
                    // Hubo un error en el server
                    console.log("error");
                }
            })
            .catch(error => {
                // Hubo un error en el server
                console.log("error");
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
        if (this.props.user && this.props.user.adminPermissions.captures) {
            return (
                <div className="dashboard container">
                    <form onSubmit={this.handleSubmitSearch} className="admin-actions" style={{ margin: "40px auto", backgroundColor: "white" }}>
                        <input placeholder="Mission ID" onChange={this.handleChange} id="busqueda" />
                        {/* <button type="submit" value="Guardar" >Make admin</button> */}
                    </form>
                    <div className ="row">
                        <div className="col s12 m6">
                            <CapturesList captures={this.state.capturesBusqueda} searching={this.state.searching}/>
                        </div>
                        {/* <div className="col s12 m5 offset-m1">
                            <Notifications />
                        </div> */}
                    </div>
                </div>
            )
        } else {
            return (
                <div className="dashboard container" style={{ backgroundColor: "white" }}>
                    You do not have permission to edit this categorie.
                </div>
            )
        }
    }
}

// firebase.auth.onAuthStateChanged(user => {
//     if (user) {
//         console.log("si user");
//     }
// });

const mapDispatchToProps = (dispatch) => {
    return {
        signOut: () => dispatch(signOut()),
        loadLoggedUserData: (uid) => dispatch(loadLoggedUserData(uid)),
    }
}

const mapStateToProps = (state) => {
    // if (!state.firebase.profile.isEmpty)
    // {
    //     console.log(state.firebase.profile.token.claims);
    // }
    return {
        auth: state.firebase.auth,
        profile: state.firebase.profile,
        user: state.userReducer.loggedUser
    }
}

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
)(Captures)
