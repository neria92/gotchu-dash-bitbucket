import React from 'react';
import {BrowserRouter, Switch, Route } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import Dashboard from './components/dashboards/Dashboard'
import ProjectDetails from './components/projects/ProjectDetails'
import SingIn from './components/auth/SingIn'
import SingUp from './components/auth/SingUp'
import Users from './components/Users/Users'
import CreateProject from './components/projects/CreateProject'

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Navbar />
        <Switch>
          <Route exact path='/' component={Dashboard} />
          <Route path='/project/:id' component={ProjectDetails} />
          <Route path='/singin' component={SingIn}/>
          <Route path='/singup' component={SingUp}/>
          <Route path='/users' component={Users}/>
          <Route path='/user/:id' component={UserDetails} />
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
