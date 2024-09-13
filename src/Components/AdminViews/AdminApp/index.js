import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MdAccountCircle } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { CiSearch, CiPhone } from "react-icons/ci";
import { IoMdTime } from "react-icons/io";
import './adminviews.css';

const BASE_URI = process.env.REACT_APP_BASE_API || 'http://localhost:4000';

// Function to calculate the final amount with simple interest
const calculateFinalAmount = (amount, interestRate, days) => {
    const years = days / 365; // Convert days to years
    return amount * (1 + (interestRate / 100) * years);
};
const calculateDaysLeft = (endDate) => {
    const today = new Date(); // Current date
    const end = new Date(endDate); // End date of the investment
    const timeDiff = end - today; // Difference in milliseconds
    const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)); // Convert milliseconds to days

    return daysLeft >= 0 ? daysLeft : 0; // Ensure non-negative days
};
const calculateDaysElapsed = (startDate, todayDate) => {
    const start = new Date(startDate);
    const today = new Date(todayDate);
    const timeDiff = today - start; // Time difference in milliseconds
    return Math.max(Math.ceil(timeDiff / (1000 * 60 * 60 * 24)), 0); // Convert milliseconds to days
};

const calculateProfitEarned = (amount, interestRate, startDate, todayDate) => {
    const daysElapsed = calculateDaysElapsed(startDate, todayDate);
    const period = 700; // Total period in days
    const simpleInterest = amount * (interestRate / 100) * (daysElapsed / period);
    return simpleInterest;
};
export default function AdminApp({ setRole }) {
    const [pendingInvestments, setPendingInvestments] = useState([]);
    const [approvedInvestments, setApprovedInvestments] = useState([]);
    const [kycs, setKycs] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredPendingInvestments, setFilteredPendingInvestments] = useState([]);
    const [filteredApprovedInvestments, setFilteredApprovedInvestments] = useState([]);
    const [filteredKycs, setFilteredKycs] = useState([]);
    const navigate = useNavigate();

    // Function to fetch all data
    const fetchData = async () => {
        try {
            const token = localStorage.getItem('authToken');
            
            // Fetch all users
            const usersResponse = await axios.get(`${BASE_URI}/api/admin/users`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const users = usersResponse.data;

            // Fetch pending plans
            const pendingPlansResponse = await axios.get(`${BASE_URI}/api/admin/pending-plans`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const pendingPlans = pendingPlansResponse.data;

            // Fetch approved plans
            const approvedPlansResponse = await axios.get(`${BASE_URI}/api/admin/approved-plans`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const approvedPlans = approvedPlansResponse.data;

            // Set all data and initialize filtered lists
            setPendingInvestments(pendingPlans.map(plan => ({
                _id: plan._id,
                fullName: plan.fullName,
                phone: plan.phone,
                queryDate: new Date(plan.queryDate),
                planTitle: plan.planTitle,
                amountInvested: plan.amountInvested,
                withdrawal: plan.withdrawal,
                approved: plan.approved
            })));
            setApprovedInvestments(approvedPlans.map(plan => ({
                _id: plan._id,
                fullName: plan.fullName,
                phone: plan.phone,
                planTitle: plan.planTitle,
                planStartDate: new Date(plan.planStartDate),
                planEndDate: new Date(plan.planEndDate),
                amountInvested: plan.amountInvested,
                remainingDays: Math.max(0, Math.ceil((new Date(plan.planEndDate) - new Date()) / (1000 * 60 * 60 * 24))),
                withdrawal: plan.withdrawal,
                approved: plan.approved
            })));
            setKycs(users.map(user => ({
                _id: user._id,
                fullName: user.fullName,
                phone: user.phone,
                email: user.email,
                kycStatus: user.kycStatus,
                adhaarNo : user?.adhaarNo || 'N/A',
                panNo : user?.panNo || 'N/A',
                accNo : user?.accNo || 'N/A',
                ifscCode : user?.ifscCode || 'N/A'
            })));

            // Initialize filtered lists
            setFilteredPendingInvestments(pendingPlans);
            setFilteredApprovedInvestments(approvedPlans);
            setFilteredKycs(users);

        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData(); // Fetch data when the component mounts
    }, []);

    const handleSearch = (event) => {
        const query = event.target.value.toLowerCase();
        setSearchQuery(query);

        // Filter pending investments
        setFilteredPendingInvestments(pendingInvestments.filter(investment =>
            investment.fullName.toLowerCase().includes(query) || investment.phone.toString().includes(query)
        ));

        // Filter approved investments
        setFilteredApprovedInvestments(approvedInvestments.filter(investment =>
            investment.fullName.toLowerCase().includes(query) || investment.phone.toString().includes(query)
        ));

        // Filter KYC statuses
        setFilteredKycs(kycs.filter(kyc =>
            kyc.fullName.toLowerCase().includes(query) || kyc.phone.toString().includes(query)
        ));
    };

    const handleLogout = () => {
        setRole('none');
        localStorage.clear();
        navigate('/register');
    };

    const handleApprove = async (planId) => {
        try {
            const token = localStorage.getItem('authToken');
            await axios.patch(`${BASE_URI}/api/admin/approve-plan/${planId}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchData(); // Refresh data after approval
        } catch (error) {
            console.error('Error approving plan:', error);
        }
    };

    const handleWithdraw = async (planId) => {
        try {
            const token = localStorage.getItem('authToken');
            await axios.patch(`${BASE_URI}/api/admin/withdraw-all/${planId}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('withdrawal processed successfully');
            fetchData(); // Refresh data after withdrawal approval
        } catch (error) {
            console.error('Error approving withdrawal:', error);
            alert('Either maturity not reached or plan does not exists');
        }
    };
    const handleWithdrawInterest = async (planId) => {
        try {
            const token = localStorage.getItem('authToken');
            await axios.patch(`${BASE_URI}/api/admin/withdraw-interest/${planId}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
        
            alert('withdrawal processed successfully');
            fetchData(); // Refresh data after withdrawal approval
        } catch (error) {
            console.error('Error approving withdrawal:', error);
            alert('Either maturity not reached or plan does not exists');
        }
    }
    const handleKycApproval = async (userId) => {
        try {
            const token = localStorage.getItem('authToken');
            await axios.patch(`${BASE_URI}/api/admin/approve-kyc/${userId}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchData(); // Refresh data after KYC approval
        } catch (error) {
            console.error('Error approving KYC:', error);
        }
    };

    return (
        <div>
            <div className="navbar-container">
                <h1>Investment Tracker - Admin</h1>
                <div className="search-container">
                    <CiSearch />
                    <input 
                        placeholder="Search by Name or Phone" 
                        name='userquery' 
                        value={searchQuery}
                        onChange={handleSearch}
                    />
                </div>
                <div className='auth-user-container'>
                    <MdAccountCircle className='account-icon' size={26} />
                    <button onClick={handleLogout}>Logout</button>
                </div>
            </div>
            <div className="user-requests">
                <div className="pending">
                    <h2>Pending Investments</h2>
                    {filteredPendingInvestments.map((investment, index) => (
                        <div key={index} className="investment-card-admin">
                            <div>
                                <h3>{investment.fullName}</h3>
                                <p><CiPhone />{investment.phone}</p>
                            </div>
                            <p><strong>Plan Title:</strong> {investment.planTitle}</p>
                            <div>
                                <p><strong>Amount Invested:</strong> ₹{investment.amountInvested}</p>
                                <p><strong>Date of Request:</strong> {new Date(investment.queryDate).toDateString()}</p>
                            </div>
                            <button onClick={() => handleApprove(investment._id)}>Approve</button>
                        </div>
                    ))}
                </div>
                <div className="approved">
                    <h2>Approved Investments</h2>
                    {filteredApprovedInvestments.map((investment, index) => {
                        const finalAmount = calculateFinalAmount(
                            investment.amountInvested,
                            5, // Example interest rate
                            Math.max((new Date() - new Date (investment.planStartDate)) / (1000 * 60 * 60 * 24), 0)
                        ); // Use elapsed days for calculation
                        const profitEarned = calculateProfitEarned(
                            investment.amountInvested,
                            investment.planInterestRate,
                            investment.planStartDate,
                            new Date() // Use current date for profit calculation
                        );
                        const daysLeft = calculateDaysLeft(investment.planEndDate);
                        return (
                            <div key={index} className="investment-card-admin">
                                <div>
                                    <h3>{investment.fullName}</h3>
                                    <p><CiPhone />{investment.phone}</p>
                                </div>
                                <div>
                                    <p><strong>Plan Title:</strong> {investment.planTitle}</p>
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
                                <button
                                    onClick={() => handleWithdrawInterest(investment._id)}
                                > Approve Profit Withdraw {profitEarned.toFixed(2)}</button>
                                <button
                                    onClick={() => handleWithdraw(investment._id)}
                                    disabled={investment.remainingDays > 0} // Disable button if days left is greater than 0
                                    className={investment.remainingDays > 0 ? 'withdraw-button-admin disabled' : 'withdraw-button-admin'}
                                >
                                    Approve Withdraw
                                </button>
                            </div>
                        );
                    })}
                </div>
                <div className="kyc">
                    <h2>KYC Status</h2>
                    {filteredKycs.map((kyc, index) => (
                        <div key={index} className="investment-card-admin kyc-section">
                            <h3>{kyc.fullName}</h3>
                            <p><strong>Email:</strong> {kyc.email}</p>
                            <p><strong>Phone:</strong> {kyc.phone}</p>
                            <p><strong>Addhaar:</strong> {kyc.adhaarNo}</p>
                            <p><strong>PAN:</strong> {kyc.panNo}</p>
                            <p><strong>Account No:</strong> {kyc.accNo}</p>
                            <p><strong>Ifsc:</strong> {kyc.ifscCode}</p>
                            <p><strong>KYC Status:</strong> {kyc.kycStatus ? 'Approved' : 'Pending'}</p>
                            {!kyc.kycStatus && (
                                <button onClick={() => handleKycApproval(kyc._id)}>Approve KYC</button>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

