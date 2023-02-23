import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Main from './components/Main';
import {
  BrowserRouter as Router,
  Routes as Switch,
  Route
} from "react-router-dom";
import Navbar from './components/Navbar';
import Login from './components/Login';


ReactDOM.render(
  <div>
    <Router>
      <Navbar></Navbar>
          <Switch>
            <Route path="/" element={<Main />} />
          </Switch>
          <Switch>
            <Route path="/login" element={<Login />} />
          </Switch>
      </Router> 
  </div>
  ,
  document.getElementById('root')
);


