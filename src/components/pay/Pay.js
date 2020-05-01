import React, { Component } from 'react'
import PaymentsList from './PayList'
import { connect } from 'react-redux'
import { firestoreConnect } from 'react-redux-firebase'
import { compose } from 'redux'
import { Redirect } from 'react-router-dom'
import { resetMoney } from '../../store/actions/userActions'
import { signOut } from '../../store/actions/authActions'

class Pay extends Component {
    constructor(props) {
        super(props)
        this.state = {
            projectsLoaded: false,
            busqueda: "",
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
        this.setState({ searching: true })
        //this.getSearchResults(false);
    }

    componentDidMount() {
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
        // var payout = {
        //     "method": "bank_account",
        //     "bank_account": {
        //         "clabe": "012298026516924616",
        //         "holder_name": "Gotchu Agent"
        //     },
        //     "amount": 10.50,
        //     "description": "Galletas Taifelds"
        // };

        // fetch('https://us-central1-gchgame.cloudfunctions.net/sendPayment', {
        //     method: 'POST',
        //     headers: {
        //         Accept: 'application/json',
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify({
        //         uid: "test id",
        //         payout: payout
        //     }),
        // })

        fetch("https://us-central1-gchgame.cloudfunctions.net/sendPayment", {
            method: 'POST',
            mode: 'cors',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
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
            })
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
        return (
            <div className="dashboard container">
                <div className="s12 m5 " style={{ color: "Red"}}>
                    <p>Total a pagar: {this.state.totalPayment}</p>
                </div>
                <button disabled={this.state.payingInProgress} onClick={this.payButtonOnClick} className="btn waves-effect waves-light" name="Subir" style={{ backgroundColor: "red" }}>Pagar a todos</button>
                <div className="row">
                    <div className="col s12 m6">
                        <PaymentsList users={this.state.usersFilteredForPayment} searching={this.state.searching} />
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
        resetMoney: (capture) => dispatch(resetMoney(capture))
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
    }
}

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    firestoreConnect(props => {
        //console.log(props.filter.charAt(0).toUpperCase() + props.filter.slice(1))
        return [
            { collection: 'users', where: [['money', '>=', 15]] }
        ]
    }),
)(Pay)
