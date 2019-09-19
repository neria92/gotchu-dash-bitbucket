import React, { Component } from 'react'
import { connect } from 'react-redux'
import { signIn } from '../../store/actions/authActions'
import { Redirect } from 'react-router-dom'

class SingIn extends Component {
    state = {
        email: '',
        password: ''
    }

    handleChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        })
    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.signIn(this.state, "email");
    }

    handleSubmitGoogle = () => {
        this.props.signIn(this.state, "google");
    }

    handleSubmitFaceBook = () => {
        this.props.signIn(this.state, "facebook");
    }

    handleSubmitTwitter = () => {
        this.props.signIn(this.state, "twitter");
    }

    render() {
        const { authError, auth } = this.props

        if (auth.uid) return <Redirect to='/'></Redirect>
        return (
            <div className="container">
                <form onSubmit={this.handleSubmit} className="white">
                    <h5 className="grey-text text-darken-3">Sign In</h5>
                    <div className="input field">
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" onChange={this.handleChange} />
                    </div>
                    <div className="input field">
                        <label htmlFor="password">Password</label>
                        <input type="password" id="password" onChange={this.handleChange} />
                    </div>
                    <div className="input-field">
                        <button className="btn black lighten-1 z-depth-0">Email Login</button>
                        <div className="red-text center">
                            {authError ? <p>{authError}</p> : null}
                        </div>
                    </div>
                    <div className='divider'></div>
                    <button type="button" className="btn #ffb74d orange lighten-2 z-depth-0" onClick={this.handleSubmitGoogle}>Google</button>
                    <div className='divider'></div>
                    <button type="button" className="btn blue darken-3 z-depth-0" onClick={this.handleSubmitFaceBook}>Facebook</button>
                    <div className='divider'></div>
                    <button type="button" className="btn #42a5f5 blue lighten-1 z-depth-0" onClick={this.handleSubmitTwitter}>Twitter</button>
                </form>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        authError: state.auth.authError,
        auth: state.firebase.auth
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        signIn: (creds, provider) => dispatch(signIn(creds, provider))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SingIn)
