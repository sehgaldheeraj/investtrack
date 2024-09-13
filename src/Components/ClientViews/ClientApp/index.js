import { useState, useEffect } from "react";
import axios from "axios";
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Login from "../Login";
import Navbar from "../Navbar";
import Register from "../Register";
import { Route, Routes, useNavigate } from "react-router-dom";
import './clientapp.css';
import Investments from "../Investments";

const validationSchema = Yup.object({
    amount: Yup.number()
      .typeError('Amount must be a number')
      .min(10000, 'Minimum amount is ₹10,000')
      .required('Amount is required'),
  });

/* espnt-disable import/no-anonymous-default-export */
export default function ClientApp({ setRole }) {
    const [loggedIn, setLoggedIn] = useState(() => {
        // Retrieve loggedIn state from localStorage
        const saved = localStorage.getItem('loggedIn');
        return saved === 'true';
    });
    const [registered, setRegistered] = useState(false);
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            amount: 10000,
        }
    });
    const getToken = () => {
        return localStorage.getItem('authToken'); // Replace with your actual token retrieval logic
    };
    const onSubmit = async (data) => {
        try {
            const token = getToken();
            const response = await axios.post('http://localhost:4000/api/user/plan', {
                amount: data.amount
            }, {
                headers: {
                    Authorization: `Bearer ${token}` // Include the token in the Authorization header
                }
        });
            if (response.status === 201) {
                alert(response.data.message); // Display the success message
                //navigate('/investments'); // Redirect after success
            }
        } catch (error) {
            console.error('Error during the API call:', error.message);
            alert('There was an error processing your request.');
        }
    };
    useEffect(() => {
        if (registered) {
            navigate('/login');
            setRegistered(false);
        } else if (loggedIn) {
            navigate('/investments');
        }
    }, [registered, loggedIn, navigate]);
    useEffect(() => {
        // Store loggedIn state in localStorage whenever it changes
        localStorage.setItem('loggedIn', loggedIn);
    }, [loggedIn]);
    return (
        <div>
            <Navbar loggedIn={loggedIn} setLoggedIn={setLoggedIn} setRole={setRole}/>
            <div className="home-page-container">
                {!loggedIn? (
                    <div className="landing-page-container">
                        <h2>Start Investing with few easy steps:</h2>
                            <h2>1</h2>
                            <p>Complete your KYC</p>
                            <h2>2</h2>
                            <p>Select an amount to invest</p>
                            <h2>3</h2>
                            <p>Get returns over 700 days</p>
                            <h2>4</h2>
                            <p>5% Interest Rate</p>
                            <h2>5</h2>
                            <p>Simple Interest</p>
                            <h2>6</h2>
                            <p>Withdraw after maturity</p>
                    </div>
                ):(
                    <div className="investment-input-container">
                        <h2>Enter the amount to Invest</h2>
                        <form className="invest-form" onSubmit={handleSubmit(onSubmit)}>
                            <div>
                                <label htmlFor="amount">Investment Amount (INR)</label>
                                <input id="amount" type="number" {...register('amount')} />
                                {errors.amount && <p className='error'>{errors.amount.message}</p>}
                            </div>
                            <button type="submit">Submit</button>
                        </form>

                    </div>
                )}
                
                <div className="right-container">
                    <Routes>
                        <Route path="/register" element={<Register setRegistered={setRegistered} />} />
                        <Route path="/login" element={<Login setLoggedIn={setLoggedIn} setRole={setRole}/>} />
                        <Route path='/investments' element={<Investments />} />
                        <Route path="/" element={registered ? <Login setLoggedIn={setLoggedIn} setRole={setRole} /> : <Register setRegistered={setRegistered} />} />
                    </Routes>
                </div>
            </div>  
        </div>
    )
}