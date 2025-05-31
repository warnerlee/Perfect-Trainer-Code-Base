import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from './components/layout/Navbar';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import AuthContext from './context/AuthContext';
import Customers from './components/customers/Customers';

export default function Router() {

  const { loggedIn } = useContext(AuthContext);

  return (
    <BrowserRouter>
        <Navbar />
        <Routes>
            <Route exact path='/' />
            {
              loggedIn === false &&
              <>
                <Route exact path='/register' Component={Register} />
                <Route exact  path='/login' Component={Login}/>
              </>
            }
            {
              loggedIn === true &&
              <>
                <Route exact path='/customer' Component={Customers}>
                </Route>
              </>
            }
        </Routes>
    </BrowserRouter>
  );
}
