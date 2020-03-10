import React from 'react'
import { NavLink } from 'react-router-dom' 
import { connect} from 'react-redux'
import { signOut } from '../../store/actions/authActions'

const SingedInLinks = (props) => {
    return(
     <ul className="right">
        <li> <NavLink to='/'> Missions</NavLink></li>
        <li> <NavLink to='/users'> Users</NavLink></li>
        <li> <NavLink to='/captures'> Captures</NavLink></li>
        <li> <NavLink to='/microtasks'> Microtasks</NavLink></li>
        <li> <a onClick={props.signOut}> Log Out</a></li>
     </ul>
    )
}

const mapDispatchToProps = (dispatch) => {
    return{
        signOut: () => dispatch( signOut() )
    }
}

export default connect(null,mapDispatchToProps)(SingedInLinks)