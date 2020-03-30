import React, { Component } from 'react'
import Notifications from './Notifications'
import ProjectList from'../projects/ProjectList'
import { connect} from 'react-redux'
import { firestoreConnect } from 'react-redux-firebase'
import {compose} from 'redux'
import {Redirect} from 'react-router-dom'
import { functions } from 'firebase'
import { signOut } from '../../store/actions/authActions'
import { Link } from 'react-router-dom'
//import { addMultipleProjects } from '../../store/actions/projectActions'
import { reduxFirestore, getFirestore } from 'redux-firestore'

class Dashboard extends Component {
    state = {
        projectsLoaded: false,
        busqueda: "",
        activePage: 1,
        projectsBusqueda: null
    };
    filteredProjects= null

    handleSubmit = (e) => {
        e.preventDefault();
        console.log("submited");
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
        console.log(obj);
        const firestore = getFirestore();
        const size = obj.length;
        for (var i = 0; i < size; i++) {
            firestore.collection('missions').add(obj[i]).then((res) => {

                console.log("Upload complete : ", res.id)

            })
                .catch(error => {
                    console.log("error : ", error)
                });
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
        this.getSearchResults(false);
    }

    componentDidMount(){
        this.setState({
            busqueda: ''
        })
        this.getSearchResults(true);
    }

    setStartProjects(){
        this.setState({
            ...this.state,
            projectsLoaded: true
        })
        this.filteredProjects = this.props.projects;
    }

    getSearchResults(getAll){

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

        var fr = getAll ? { contentType: { missions: true, captures: false, users: false, hashtags: false } } : { contentType: { missions: true, captures: false, users: false, hashtags: false }, whiteKeywords: [this.state.busqueda] }
        fetch("https://us-central1-gchgame.cloudfunctions.net/dashboardSearch", {
            method: 'POST',
            mode: 'cors',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                UID: "0",
                startIndex: 0,
                numberOfFeeds: 500,
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
                        projectsBusqueda: res[1].result
                    })
                    //console.log(res[1].result);
                    console.log(this.state.projectsBusqueda);

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
        
        const { auth, profile } = this.props;
        
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
                    <form onSubmit={this.handleSubmitSearch} className="admin-actions" style={{ margin: "20px auto", backgroundColor: "white" }}>
                        <input placeholder="Titulo" onChange={this.handleChange} id="busqueda" />
                        {/* <button type="submit" value="Guardar" >Make admin</button> */}
                    </form>
                    
                    <div className ="row">
                        {/* <Link to="/project/new"><button>Nueva mission</button></Link> */}
                        <div className="col s12 m6">
                            <Link to={{pathname:"/project/new", state:{id:"new"}}}><button className="btn waves-effect waves-light" type="submit" name="action">Nueva Mission</button></Link>

                            {/* <div class="row" style={{ width: "560px auto", backgroundColor: "white" }}>
                                <div class="col s12 m12 l12" >
                                    <ul class="pagination">
                                        <li class="disabled"><a href="#!">
                                            <i >&larr;</i></a></li>
                                        <li class="active"><a href="#!">1</a></li>
                                        <li class="waves-effect"><a href="#!">2</a></li>
                                        <li class="waves-effect"><a href="#!">3</a></li>
                                        <li class="waves-effect"><a href="#!">4</a></li>
                                        <li class="waves-effect"><a href="#!">5</a></li>
                                        <li class="waves-effect"><a href="#!">
                                            <i >&rarr;</i></a></li>
                                    </ul>
                                </div>
                            </div>       */}

                            
                  
                            <ProjectList projects={this.state.projectsBusqueda}/* pasar resultado de busqueda *//>
                            <form onSubmit={this.handleSubmitUploadJson} className="admin-actions" style={{ margin: "20px auto", backgroundColor: "white" }}>
                                <textarea onChange={this.handleChange} ref="JsonText" required style={{ height: 200 }}/>
                                <button className="btn waves-effect waves-light" type="submit" name="Subir" style={{ backgroundColor: "red" }}>Subir JSON</button>
                                {/* <button type="submit" value="Guardar" >Make admin</button> */}
                            </form>
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
        signOut: () => dispatch(signOut()),
        //addMultipleProjects: (projects) => dispatch(addMultipleProjects(projects)),
    }
}

const mapStateToProps = (state) => {
    return {
        auth: state.firebase.auth,
        profile: state.firebase.profile
    }
}

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
  )(Dashboard)
