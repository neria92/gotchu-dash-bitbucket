import React, { Component } from 'react'
import {connect } from 'react-redux'
import {createProject} from '../../store/actions/projectActions'
import {Redirect} from 'react-router-dom'
import {getLocation} from '../../store/actions/geoActions'

 class CreateProject extends Component {
     state = {
         km: 0,
         url: null,
         missionID : null
     }

     handleChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        })
     }
     handleSubmit = (e) => {
        e.preventDefault();
        const {missionID} = this.props;
        const km = this.state.km;
        const url = this.state.url;
        this.props.createProject({km,missionID,url});
     }

    render() {


        const {captureCreated,auth} = this.props;
        if(!auth.uid) return <Redirect to='/singin'></Redirect>
        return (
            <div className="container">
                <form onSubmit={this.handleSubmit} className="white">
                <div className="input field">
                        <label htmlFor="email">random km ( 0 or empty for exact position ) </label>
                        <input type="text" id="km" onChange={this.handleChange}/>
                    </div> 
                    <div className="input field2">
                        <label htmlFor="url">Url Imagen ( Si dejan en blanco, se enviara request 1</label>
                        <input type="text" id="url" onChange={this.handleChange}/>
                    </div>
                    <div className="input-field">
                        <button className="btn black lighten-1 z-depth-0">Submit Capture</button>
                        
                        <div className="green-text center">
                        {captureCreated['Result']?"Result: ":null}{captureCreated['Result']?captureCreated['Result']:null}{captureCreated['Result']?<br/>:null}
                        {captureCreated['Right Location?']?"Right Location?: ":null}{captureCreated['Right Location?']?captureCreated['Right Location?']:null}{captureCreated['Right Location?']?<br/>:null}
                        {captureCreated['Right Time?']?"Right Time?: ":null}{captureCreated['Right Time?']?captureCreated['Right Time?']:null}{captureCreated['Right Time?']?<br/>:null}
                        </div>
                        <div className="red-text center">
                        {captureCreated['error']?"Error: ":null}{captureCreated['error']?captureCreated['error']:null}{captureCreated['error']?<br/>:null}
                        </div>
                    </div>
                </form>
            </div>
        )
    }
}

const mapStateToProps = (state) =>{
    return{
        auth: state.firebase.auth,
        captureCreated: state.server.body
    }
}

const mapDispathToProps = (dispatch) => {
    return{
        createProject:(capture) => dispatch(createProject(capture))
    }
}

export default connect(mapStateToProps,mapDispathToProps)(CreateProject)
