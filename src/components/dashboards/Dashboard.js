import React, { Component } from 'react'
import Notifications from './Notifications'
import ProjectList from'../projects/ProjectList'
import { connect} from 'react-redux'
import { firestoreConnect } from 'react-redux-firebase'
import {compose} from 'redux'
import {Redirect} from 'react-router-dom'
import { functions } from 'firebase'
import { signOut } from '../../store/actions/authActions'
import { setSearchString } from '../../store/actions/projectActions'
import { loadLoggedUserData } from '../../store/actions/userActions'
import { Link } from 'react-router-dom'
import DatePicker from 'react-datepicker'
//import { addMultipleProjects } from '../../store/actions/projectActions'
import { reduxFirestore, getFirestore } from 'redux-firestore'
import { setStartDateChecked, setStartDate } from '../../store/actions/projectActions'
import { cloudFunctionsURL } from '../config/fbConfig'

class Dashboard extends Component {
    state = {
        projectsLoaded: false,
        busqueda: "",
        activePage: 1,
        projectsBusqueda: null,
        searching: false,
        missionsUploaded: 0,
        uploadJsonError: null,
        jsonErrorString: "",
        startDateChecked: false,
        startDate: null
    };
    filteredProjects= null

    handleSubmit = (e) => {
        e.preventDefault();
        
    }

    handleSubmitUploadJson = (e) => {
        
        e.preventDefault();
        this.setState({ jsonErrorString: "Subiendo Json" })
        const text = this.refs.JsonText.value
        var obj = JSON.parse(text)
        const firestore = getFirestore();
        const size = obj.length;
        //var uploadError = false
        var i
        for ( i = 0; i < size; i++) {
            
            var captureTitle
            //console.log("subiendo a firebase" + obj[i].title.es)
            firestore.collection('missions').add(obj[i]).then((res) => {
                //get mision title
                firestore.get({ collection: "missions", doc: res.id })
                    .then((doc) => {
                        if (doc != undefined && doc.data().title.es != null) {
                            captureTitle = doc.data().title.es
                            //console.log(doc.data().title.es)

                            var es = this.state.jsonErrorString
                            es = es.concat("\nMission " + captureTitle + " uploaded successfully.")
                            //console.log(res)
                            this.setState({ jsonErrorString: es })
                        }
                    })
                    .catch((error) => {
                        console.log("Error getting mission title from id: " + res.id)
                    });
            })
            .catch(error => {
                var es = this.state.jsonErrorString
                //es = es.concat("\nERROR: Mission " + error + " not uploaded.")
                es = es.concat("\nFirestore error: " + error)
                //es = es.concat("\nAborting ")
                this.setState({ jsonErrorString: es })
                //uploadError = true
                //console.log(error)
            });
            
        }
        
    }

    handleChange = (e) => {
        e.preventDefault();
        this.setState({
            [e.target.id]: e.target.value
        })
    }

    startDateChecked = (e) => {
        //e.preventDefault();
        //console.log( this.props.startDate)
        var sdc = false
        if (this.refs.startDateChecked.checked)
            sdc = true
        
        this.setState({ startDateChecked: sdc, searching: true })
        this.getSearchResults(this.refs.busqueda.value, sdc, this.props.startDate);
        this.props.setStartDateChecked(sdc);
    }

    handleSubmitSearch = (e) => {
        e.preventDefault();
        this.props.setSearchString(this.refs.busqueda.value)
        this.setState({ ...this.state,searching: true})
        this.getSearchResults(this.refs.busqueda.value, this.state.startDateChecked, this.props.startDate);
    }

    componentDidMount(){
        //console.log(this.props.startDateChecked)
        var s = false
        if (this.props.auth.uid !== undefined && !this.props.user){
            this.props.loadLoggedUserData(this.props.auth.uid)
        }
        if(!(this.props.searchString === "")){
            s = true
        }

        var t0 = new Date();
        if (this.props.startDate !== null) {
            t0 = new Date(this.props.startDate);
        } 

        if (this.refs.startDateChecked && this.refs.startDateChecked !== undefined)
            this.refs.startDateChecked.checked = this.props.startDateChecked
        this.setState({ searching: s, busqueda: this.props.searchString, startDateChecked: this.props.startDateChecked, startDate: t0 })
        this.getSearchResults(this.props.searchString, this.props.startDateChecked, this.props.startDate);

    }

    getSearchResults(search, sdc, sd){
        //console.log(search)
        //console.log(sdc)
        var fr;
        if (sdc){
            //console.log("CON startdate")
            fr = (search === "") ? { contentType: { missions: true, captures: false, users: false, hashtags: false }, startDate: Number(sd / 1000.0) } : { contentType: { missions: true, captures: false, users: false, hashtags: false }, whiteKeywords: [search], startDate: Number(this.state.startDate / 1000.0) }
        } else {
           // console.log("SIN startdate")
            fr = (search === "") ? { contentType: { missions: true, captures: false, users: false, hashtags: false } } : { contentType: { missions: true, captures: false, users: false, hashtags: false }, whiteKeywords: [search] }
        }
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
                sortBy: sdc ? "location" : "date",
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
                    //console.log(res[1].result);
                    var r = res[1].result
                    if (sdc) {
                        r = r.sort(function (a, b) { return b.startDate - a.startDate });
                    }

                    this.setState({
                        ...this.state,
                        projectsBusqueda: r,
                        searching: false
                    })

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
        const { startDate } = this.state;
        
        if(!auth.uid) return <Redirect to='/singin'></Redirect>
        if (!profile.isEmpty) {
            if(!profile.token.claims.admin){
                this.props.signOut();
            }
        }

        if (this.props.user && this.props.user.adminPermissions.missions) {
            return (
                <div className="dashboard container">
                    <form onSubmit={this.handleSubmitSearch} className="admin-actions" style={{ margin: "20px auto", backgroundColor: "white" }}>
                        <input placeholder="Titulo" defaultValue={this.state.busqueda} onChange={this.handleChange} ref="busqueda" id="busqueda" />
                        {/* <button type="submit" value="Guardar" >Make admin</button> */}
                    </form>
                    
                    <div className ="row">
                        {/* <Link to="/project/new"><button>Nueva mission</button></Link> */}
                        <div className="col s12 m6">
                            <Link to={{pathname:"/project/new", state:{_id:"new"}}}><button className="btn waves-effect waves-light" type="submit" name="action">Nueva Mission</button></Link>

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
                            <p>
                                <label>
                                    <input type="checkbox" defaultChecked={this.state.startDateChecked} id="startDateChecked" ref="startDateChecked" onChange={this.startDateChecked} />
                                    <span>Limitar a fecha de Inicio</span>
                                </label>
                            </p>

                            
                            <div style={{  backgroundColor: "white" }}>
                                <DatePicker selected={startDate} onChange={startDate => { 
                                    if(this.state.startDateChecked){
                                        this.setState({ startDate: startDate, searching: true })
                                        this.getSearchResults(this.refs.busqueda.value, this.props.startDateChecked, this.props.startDate); 
                                    } else {
                                        this.setState({ startDate: startDate })
                                    }
                                    this.props.setStartDate(startDate);
                                }}
                                    showTimeSelect
                                    timeFormat="HH:mm"
                                    timeIntervals={15}
                                    timeCaption="time"
                                    dateFormat="MMMM d, yyyy h:mm aa"
                                />
                            </div> 
                  
                            <ProjectList projects={this.state.projectsBusqueda} searching={this.state.searching}/* pasar resultado de busqueda *//>
                            <form onSubmit={this.handleSubmitUploadJson} className="admin-actions" style={{ margin: "20px auto", backgroundColor: "white" }}>
                                <textarea onChange={this.handleChange} ref="JsonText" required style={{ height: 200 }}/>
                                <button className="btn waves-effect waves-light" type="submit" name="Subir" style={{ backgroundColor: "red" }}>Subir JSON</button>
                                {/* <button type="submit" value="Guardar" >Make admin</button> */}
                                <textarea disabled={true} value={this.state.jsonErrorString} onChange={this.handleChange} ref="JsonErrorText" id="JsonErrorText" required style={{ height: 50 }} />
                            </form>
                            <div >
                                <Notifications uploadJsonError={this.state.uploadJsonError} missionsUploaded={this.state.missionsUploaded}/>
                            </div>
                        </div>
                        {/* <div className="col s12 m5 offset-m1">
                            <Notifications />
                        </div> */}
                    </div>
                </div>
            )
        }
        else {
            return(
                <div className="dashboard container" style={{backgroundColor:"white"}}>
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
        setSearchString: (searchString) => dispatch(setSearchString(searchString)),
        loadLoggedUserData: (uid) => dispatch(loadLoggedUserData(uid)),
        setStartDateChecked: (sdc) => dispatch(setStartDateChecked(sdc)),
        setStartDate: (sd) => dispatch(setStartDate(sd))
        //addMultipleProjects: (projects) => dispatch(addMultipleProjects(projects)),
    }
}

const mapStateToProps = (state) => {
    return {
        auth: state.firebase.auth,
        profile: state.firebase.profile,
        searchString: state.projectReducer.searchString,
        user: state.userReducer.loggedUser,
        startDateChecked: state.projectReducer.startDateChecked,
        startDate: state.projectReducer.startDate,
    }
}

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
  )(Dashboard)
