import React from 'react'
import { NavLink } from 'react-router-dom'

const SingOutLinks = () => {
    return (
        <ul className="right">
            <li> <NavLink to='/singin'> Log In</NavLink></li>
            <li> <NavLink to='/singup'> Sign Up</NavLink></li>
        </ul>
    )
}

export default SingOutLinks