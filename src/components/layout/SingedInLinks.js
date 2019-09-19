import React from 'react'
import { NavLink } from 'react-router-dom' 
import { connect} from 'react-redux'
import { signOut } from '../../store/actions/authActions'

const SingedInLinks = (props) => {
    return(
     <ul className="right">
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