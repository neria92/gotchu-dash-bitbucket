import React, { Component } from 'react'
import { connect } from 'react-redux'
import { firestoreConnect } from 'react-redux-firebase'
import { compose } from 'redux'
import { Redirect } from 'react-router-dom'
import { resetMoney } from '../../store/actions/userActions'
import { signOut } from '../../store/actions/authActions'
import ChargesList from './ChargesList'
import { loadLoggedUserData } from '../../store/actions/userActions'

class Payments extends Component {
    constructor(props) {
        super(props)
        this.state = {
            projectsLoaded: false,
            busqueda: "",
            filter: '',
            usersSearch: null,
            searching: false,
            usersFilteredForPayment: null,
            lastFilteredUsers: null,
            totalPayment: 0,
            payingInProgress: false
        }
    }

    handleChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        })
    }

    handleSubmitSearch = (e) => {
        e.preventDefault();
        this.setState({ filter: this.refs.busqueda.value })
        //this.getSearchResults(false);
    }

    componentDidMount() {
        if (this.props.auth && !this.props.user) {
            this.props.loadLoggedUserData(this.props.auth.uid)
        }
        this.setState({
            busqueda: ''
        })
        //console.log(this.props.users)
    }

    componentDidUpdate() {
        if(this.state.lastFilteredUsers === this.props.users){

        } else {
            this.filterUsersForPayment();
        }
    }

    filterUsersForPayment() {
        var tp = 0
        if(this.props.users != undefined){
            var uffp = []
            this.props.users.map((user) => {
                if (user.accountName != '' && user.clabe != '' && user.email != '') {
                    uffp.push(user);
                    tp += user.money
                }
            })
            this.setState({ lastFilteredUsers: this.props.users, usersFilteredForPayment: uffp, totalPayment: tp})
        } 
        //console.log(tp)
    }

    setStartProjects() {
        this.setState({
            ...this.state,
            projectsLoaded: true
        })
        this.filteredProjects = this.props.projects;
    }

    payButtonOnClick = (e) => {
        e.preventDefault();
        this.setState({...this.state, payingInProgress: true})
        this.state.usersFilteredForPayment.map((user) => {
            console.log(user)
            this.payUser(user)
        })
    }

    payUser(user) {

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
        fetch("https://us-central1-gchgame.cloudfunctions.net/sendPayment", {
            method: 'POST',
            mode: 'cors',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: {
                uid: user.id,
                payout: {
                    "method": "bank_account",
                    "bank_account": {
                        "clabe": user.clabe,
                        "holder_name": user.accountName
                    },
                    "amount": user.money,
                    "description": "Monthly payment"
                }
            }
            ,
        }).then(response => {
            const statusCode = response.status;
            const data = response.json();
            return Promise.all([statusCode, data]);
        })
            .then(res => {
                if (res[0] == 200) {
                    // Hacer algo con lo que regresa el server = res[1].newsfeed
                    this.setState({ ...this.state, payingInProgress: false })
                    console.log(res[1].result);
                    var userID = user.id;
                    this.props.resetMoney({ userID, user});

                } else {
                    // Hubo un error en el server
                    console.log("res != 200");
                    this.setState({ ...this.state, payingInProgress: false })
                    var userID = user.id;
                    this.props.resetMoney({ userID, user});
                }
            })
            .catch(error => {
                // Hubo un error en el server
                console.log("error");
                this.setState({ ...this.state, payingInProgress: false })
                var userID = user.id;
                this.props.resetMoney({ userID, user });
            });

    }

    // handleSubmit = (e) => {
    //     e.preventDefault();

    //     const adminUID = document.querySelector('#admin-uid').value;
    //     const addAdminRole = functions().httpsCallable('addAdminRole');
    //     addAdminRole({ uid: adminUID }).then(result => {
    //         console.log(result);
    //     });
    // }

    render() {

        const { users, auth, profile } = this.props;

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
        if (this.props.user && this.props.user.adminPermissions.charges) {
            return (
                <div className="dashboard container">
                    <form onSubmit={this.handleSubmitSearch} className="admin-actions" style={{ margin: "20px auto", backgroundColor: "white" }}>
                        <input placeholder="UID" defaultValue={this.state.busqueda} onChange={this.handleChange} ref="busqueda" id="busqueda" />
                        {/* <button type="submit" value="Guardar" >Make admin</button> */}
                    </form>
                    <div className="row">
                        <div className="col s12 m6">
                            <ChargesList filter={this.state.filter} />
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
        resetMoney: (capture) => dispatch(resetMoney(capture)),
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
        users: state.firestore.ordered.users,
        user: state.userReducer.loggedUser
    }
}

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    // firestoreConnect(props => {
    //     //console.log(props.filter.charAt(0).toUpperCase() + props.filter.slice(1))
    //     return [
    //         { collection: 'users', where: [['money', '>=', 30]] }
    //     ]
    // }),
)(Payments)
