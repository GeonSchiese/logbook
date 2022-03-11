import React from "react";
import { Router, Route, Switch } from 'react-router-dom';
import LicenseList from './Licenses/LicenseList';
import LogbookList from './Logbook/LogbookList';
import Weather from './Weather/Weather';
import Dashboard from './Dashboard';
import Logbook from './Logbook/Logbook';
import LogbookConfig from "./Logbook/LogbookConfig";
import FlightConfig from './Logbook/FlightConfig';
import Home from './Home';
import createBrowserHistory from '../history';
import LicenseConfig from "./Licenses/LicenceConfig";
import LoginForm from "./LoginForm";



const App = () => {
    return (
        <Router history={createBrowserHistory}>
                <Switch>
                    <Route path="/" exact component={Home} />
                    <Route path="/login" exact component={LoginForm} />
                    <Route path="/createAccount" exact component={LoginForm} />
                    <Route path="/dashboard" exact component={Dashboard} />
                    <Route path="/weather" exact component={Weather} />
                    <Route path="/logbooks" exact component={LogbookList} />
                    <Route path="/logbooks/new" exact component={LogbookConfig} />
                    <Route path="/logbooks/edit/:id" exact component={LogbookConfig} />
                    <Route path="/logbooks/view/:id" exact component={Logbook} />
                    <Route path="/logbooks/:logbookID/flights/new" exact component={FlightConfig} />
                    <Route path="/logbooks/:logbookID/flights/edit/:flightID" exact component={FlightConfig} />
                    <Route path="/licenses" exact component={LicenseList} />
                    <Route path="/licenses/new" exact component={LicenseConfig} />
                    <Route path="/licenses/edit/:id" exact component={LicenseConfig} />
                </Switch>
        </Router>
    );
}

export default App;