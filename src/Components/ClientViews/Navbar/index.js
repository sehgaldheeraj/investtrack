import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
//import axios from 'axios';
import { MdAccountCircle } from "react-icons/md";
import { CiPhone } from "react-icons/ci";
import './navbar.css';
import KycModal from './KycModal/index'; // Import the KycModal component

//const BASE_URI = 'http://localhost:4000';

export default function Navbar({ loggedIn, setLoggedIn, setRole }) {
    const [isModalOpen, setModalOpen] = useState(false);
    
    const location = useLocation();
    const navigate = useNavigate();
    const isLoginPage = location.pathname === '/login';
    const isRegisterPage = location.pathname === '/register';
    const handleLogout = () => {
        setRole('none');
        localStorage.clear();  
        setLoggedIn(false);
        navigate('/register');
    }

    const handleKycClick = () => {
        setModalOpen(true); // Open the modal when the button is clicked
    }

    return (
        <div className="navbar-container">
            <div><h1>Investment Tracker</h1></div>
            {loggedIn ? (
                <div className='auth-user-container'>
                    <MdAccountCircle className='account-icon' size={26}/>
                    <>Call for queries<CiPhone />: <p>+91 98735 91431</p></>
                    <button onClick={handleKycClick}>Request KYC</button>
                    <button onClick={handleLogout}>Logout</button>
                </div>
            ) : (
                <div className="user-container">
                    <Link to="/login">
                        <button className={isLoginPage ? 'active' : 'inactive'}>Login</button>
                    </Link>
                    <Link to="/register">
                        <button className={isRegisterPage ? 'active' : 'inactive'}>Register</button>
                    </Link>
                </div>
            )}
            {isModalOpen && (
                <KycModal closeModal={() => setModalOpen(false)}  />
            )}
        </div>
    )
}
