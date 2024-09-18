import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { IoMdTime } from "react-icons/io";
import './investments.css'; // Import CSS for styling

const BASE_URI = 'https://api.emiratesearngrow.com' || 'http://localhost:4000';

// Function to calculate days left for maturity
const calculateDaysLeft = (endDate) => {
    const today = new Date(); // Current date
    const end = new Date(endDate); // End date of the investment
    const timeDiff = end - today; // Difference in milliseconds
    const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)); // Convert milliseconds to days

    return daysLeft >= 0 ? daysLeft : 0; // Ensure non-negative days
};

// Function to calculate days elapsed
const calculateDaysElapsed = (startDate, todayDate) => {
    const start = new Date(startDate);
    const today = new Date(todayDate);
    const timeDiff = today - start; // Time difference in milliseconds
    return Math.max(Math.ceil(timeDiff / (1000 * 60 * 60 * 24)), 0); // Convert milliseconds to days
};

// Function to calculate profit earned
const calculateProfitEarned = (amount, interestRate, startDate, todayDate) => {
    const daysElapsed = calculateDaysElapsed(startDate, todayDate);
    const period = 700; // Total period in days
    const simpleInterest = amount * (interestRate / 100) * (daysElapsed / period);
    return simpleInterest;
};

// Function to calculate final amount
const calculateFinalAmount = (amount, interestRate, startDate, todayDate) => {
    const profitEarned = calculateProfitEarned(amount, interestRate, startDate, todayDate);
    return amount + profitEarned;
};

export default function Investments() {
    const [investments, setInvestments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const fetchInvestments = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.get(BASE_URI + '/api/user/plans', {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            setInvestments(response.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchInvestments();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;
    const handleWithdrawProfit = async (planTitle) => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.get(`${BASE_URI}/api/user/requestInterest`, {
                params: { name: planTitle },
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            if (response.status === 200) {
                alert('Interest Withdrawal request recieved successfully.');
                // Optionally, you can refetch investments here to update the state
                await fetchInvestments();
            }
        } catch (error) {
            console.error('Error during the API call:', error.message);
            alert('There was an error processing your withdrawal request.');
        }
    };
    const handleWithdrawAll = async (planTitle) => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.get(`${BASE_URI}/api/user/requestAll`, {
                params: { name: planTitle },
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            if (response.status === 200) {
                alert('Whole Amount Withdrawal request recieved successfully.');
                // Optionally, you can refetch investments here to update the state
                await fetchInvestments();
            }
        } catch (error) {
            console.error('Error during the API call:', error.message);
            alert('There was an error processing your withdrawal request.');
        }
    };

    return (
        <div className="investments-container">
            <h1>Your Investment Portfolio</h1>
            <div className="cards-container">
                {investments.map(investment => {
                    let daysLeft, profitEarned, finalAmount;

                    if (investment.approved) {
                        daysLeft = calculateDaysLeft(investment.planEndDate);
                        profitEarned = calculateProfitEarned(
                            investment.amountInvested,
                            investment.planInterestRate,
                            investment.planStartDate,
                            new Date() // Use current date for profit calculation
                        );
                        finalAmount = calculateFinalAmount(
                            investment.amountInvested,
                            investment.planInterestRate,
                            investment.planStartDate,
                            investment.planEndDate
                        );
                    }

                    return (
                        <div className="investment-card" key={investment._id}>
                            {!investment.approved ? (
                                <>
                                    <div>
                                        <h3>{investment.planTitle}</h3>
                                        <div>
                                            <p><strong>Amount Invested:</strong> ₹{investment.amountInvested.toFixed(2)}</p>
                                            <p><strong>Date of Request:</strong> {new Date(investment.queryDate).toDateString()}</p>
                                        </div>
                                        <div>Approval Is Pending</div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div>
                                        <h2>{investment.planTitle}</h2>
                                        <p><IoMdTime /> {daysLeft} days left</p>
                                    </div>
                                    <div>
                                        <p><strong>Start Date:</strong> {new Date(investment.planStartDate).toDateString()}</p>
                                        <p><strong>Initial Amount:</strong> ₹{investment.amountInvested.toFixed(2)}</p>
                                    </div>
                                    <div>
                                        <p><strong>End Date:</strong> {new Date(investment.planEndDate).toDateString()}</p>
                                        <p><strong>Final Amount:</strong> ₹{finalAmount.toFixed(2)}</p>
                                    </div>
                                    <div>
                                        <p><strong>Profit Earned:</strong> ₹{profitEarned.toFixed(2)}</p>
                                        {investment.withdrawalOfInterest?(<button
                                                disabled
                                                className="withdraw-button disabled"
                                            >
                                                Withdrawal Processing
                                            </button>):(<button
                                            disabled={investment.withdrawalOfInterest}
                                            className={investment.withdrawalOfInterest > 0 ? 'withdraw-button disabled' : 'withdraw-button'}
                                            onClick={() => handleWithdrawProfit(investment.planTitle)}
                                        >Withdraw Profit: ₹{profitEarned.toFixed(2)}</button>)}
                                        
                                        <button 
                                            disabled={daysLeft > 0}
                                            className={daysLeft > 0 ? 'withdraw-button disabled' : 'withdraw-button'}
                                            onClick={() => handleWithdrawAll(investment.planTitle)}
                                        >Withdraw All</button>
                                    </div>
                                </>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}



