import React, { Component } from 'react'
import Notifications from './../dashboards/Notifications'
import ProjectList from '../projects/ProjectList'
import { connect } from 'react-redux'
import { firestoreConnect } from 'react-redux-firebase'
import { compose } from 'redux'
import { Redirect } from 'react-router-dom'
import { functions } from 'firebase'
import { signOut } from '../../store/actions/authActions'
import { setSearchString } from '../../store/actions/projectActions'
import { Link } from 'react-router-dom'
//import { addMultipleProjects } from '../../store/actions/projectActions'
import { reduxFirestore, getFirestore } from 'redux-firestore'
import { LineChart, PieChart } from 'react-chartkick'
import 'chart.js'

class Analytics extends Component {
    state = {
        projectsLoaded: false,
        busqueda: "",
        activePage: 1,
        projectsBusqueda: null,
        searching: true,
        missionsUploaded: 0,
        uploadJsonError: null,
        analyticsData: null
    };
    filteredProjects = null

    handleSubmit = (e) => {
        e.preventDefault();
        // const adminUID = document.querySelector('#admin-uid').value;
        // const addAdminRole = functions().httpsCallable('addAdminRole');
        // addAdminRole({ uid: adminUID }).then(result => {
        //     console.log(result);
        // });
    }

    handleSubmitUploadJson = (e) => {

        e.preventDefault();
        const text = this.refs.JsonText.value
        var obj = JSON.parse(text)
        const firestore = getFirestore();
        const size = obj.length;
        var uploadError = null
        var i
        for (i = 0; i < size; i++) {
            firestore.collection('missions').add(obj[i]).then((res) => {
                console.log("Upload complete : ", res.id)
            })
                .catch(error => {
                    console.log("error : ", error)
                    uploadError = error
                });
        }
        if (uploadError != null) {
            this.setState({ uploadJsonError: true, missionsUploaded: i + 1 })
        } else {
            this.setState({ uploadJsonError: false, missionsUploaded: i + 1 })
        }
        //window.location.reload();
        //this.props.addMultipleProjects(obj);
        // const adminUID = document.querySelector('#admin-uid').value;
        // const addAdminRole = functions().httpsCallable('addAdminRole');
        // addAdminRole({ uid: adminUID }).then(result => {
        // console.log(result);
        // });
    }

    handleChange = (e) => {
        e.preventDefault();
        this.setState({
            [e.target.id]: e.target.value
        })
    }

    handleSubmitSearch = (e) => {
        e.preventDefault();
        this.props.setSearchString(this.refs.busqueda.value)
        this.setState({ ...this.state, searching: true })
        this.getSearchResults(this.refs.busqueda.value);
    }

    componentDidMount() {
        this.setState({ ...this.state, busqueda: this.props.searchString })
        this.getSearchResults(this.props.searchString);
        if (!(this.props.searchString === "")) {
            this.setState({ searching: true })
        }
    }



    getSearchResults(search) {
        var fr = (search === "") ? { contentType: { missions: true, captures: false, users: false, hashtags: false } } : { contentType: { missions: true, captures: false, users: false, hashtags: false }, whiteKeywords: [search] }
        fetch("https://us-central1-gchgamedev2.cloudfunctions.net/dashboardAnalytics", {
            method: 'POST',
            mode: 'cors',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                UID: "0",
                startIndex: 0,
                numberOfFeeds: 5000,
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
                    //console.log(res[1].result)
                    var result = res[1].result
                    result.opentaskMissions = []

                    result.missions.forEach(mission => {
                        if(mission.opentask !== ""){
                            result.opentaskMissions.push(mission)
                        }
                    });

                    //cuantos usuarios han cumplido misiones
                    result.usersCompletedMissions = new Map()
                    result.captures.forEach(capture => {
                        result.usersCompletedMissions.set(capture.userId, null)
                        // if (capture.opentask !== "") {
                        //     usersCompletedMissions.push(capture)
                        // }
                    });

                    //cuantos usuarios han creado misiones opentask
                    result.usersCreatedOpenTask = new Map()
                    result.missions.forEach(mission => {
                        if (mission.opentask !== null && mission.opentask !== ""){
                            result.usersCreatedOpenTask.set(mission.opentask, null)
                        }
                        // if (capture.opentask !== "") {
                        //     usersCompletedMissions.push(capture)
                        // }
                    });
                    
                    console.log(result);
                    this.setState({
                        ...this.state,
                        analyticsData: result,
                        searching: false
                    })
                    //console.log(res[1].result);

                } else {
                    // Hubo un error en el server
                    console.log("error");
                }
            })
            .catch(error => {
                // Hubo un error en el server
                console.log(error);
            });

    }

    render() {

        const { auth, profile } = this.props;

        const data = [{ name: 'Page A', uv: 200, pv: 2400, amt: 3400 }, { name: 'Page A', uv: 600, pv: 7400, amt: 8400 }];

        if (!auth.uid) return <Redirect to='/singin'></Redirect>
        if (!profile.isEmpty) {
            if (!profile.token.claims.admin) {
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
        if (this.state.analyticsData != null) {
            return (
                <div className="dashboard container" >
                    <div className="row">
                        <div className="col s12 m6" style={{ backgroundColor: "white" }}>
                            <table class="striped">
                                <tbody>
                                    <tr>
                                        <td>Usuarios totales:</td>
                                        <td>{this.state.analyticsData.users.length}</td>
                                    </tr>
                                    <tr>
                                        <td>Misiones totales:</td>
                                        <td>{this.state.analyticsData.missions.length}</td>
                                    </tr>
                                    <tr>
                                        <td>Capturas totales:</td>
                                        <td>{this.state.analyticsData.captures.length}</td>
                                    </tr>
                                    <tr>
                                        <td>Misiones OpenTask totales:</td>
                                        <td>{this.state.analyticsData.opentaskMissions.length}</td>
                                    </tr>
                                    <tr>
                                        <td>Número de usuarios que han completado misiones:</td>
                                        <td>{this.state.analyticsData.usersCompletedMissions.size}</td>
                                    </tr>
                                    <tr>
                                        <td>Número de usuarios que han creado OpenTask:</td>
                                        <td>{this.state.analyticsData.usersCreatedOpenTask.size}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    {/* <div className="row">
                        <div className="col s12 m6" style={{ backgroundColor: "white" }}>
                            <div>
                                <h3 class="header" class="center-align">Capturas</h3>
                                <LineChart xtitle="Dia" ytitle="Capturas" id="Capturas" data={{ "2017-05-13": 2, "2017-05-14": 5, "2017-05-15": 4, "2017-05-16": 8, "2017-05-17": 6 }} />
                            </div>
                        </div>
                    </div> */}
                </div>
            )
        } else {
            return(
                <div className="dashboard container" >
                    <div style={{ margin: "20px auto", backgroundColor: "white" }} className="container center">
                        <p>Loading...</p>
                    </div>
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
        setSearchString: (searchString) => dispatch(setSearchString(searchString))
        //addMultipleProjects: (projects) => dispatch(addMultipleProjects(projects)),
    }
}

const mapStateToProps = (state) => {
    return {
        auth: state.firebase.auth,
        profile: state.firebase.profile,
        searchString: state.projectReducer.searchString
    }
}

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
)(Analytics)
