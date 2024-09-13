import React, { useState } from 'react';
import axios from 'axios';
import './KycModal.css'; // Create this CSS file for modal styling

const BASE_URI = process.env.REACT_APP_BASE_API || 'http://localhost:4000';

export default function KycModal({ closeModal }) {
    const [adhaarNo, setAdhaarNo] = useState('');
    const [panNo, setPanNo] = useState('');
    const [accNo, setAccNo] = useState('');
    const [ifscCode, setIfscCode] = useState('');
    
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.post(`${BASE_URI}/api/user/request-kyc`, {
                adhaarNo,
                panNo,
                accNo, 
                ifscCode
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.status === 200) {
                alert(response.data);
                closeModal(); // Close the modal after successful submission
            }
        } catch (error) {
            console.error('Error during the API call:', error.message);
            alert('There was an error requesting KYC.');
        }
    }

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Request KYC</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="adhaarNo">Aadhaar Number:</label>
                        <input
                            type="text"
                            id="adhaarNo"
                            value={adhaarNo}
                            onChange={(e) => setAdhaarNo(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="panNo">PAN Number:</label>
                        <input
                            type="text"
                            id="panNo"
                            value={panNo}
                            onChange={(e) => setPanNo(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="accNo">Account Number:</label>
                        <input
                            type="text"
                            id="accNo"
                            value={accNo}
                            onChange={(e) => setAccNo(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="ifscCode">IFSC Code:</label>
                        <input
                            type="text"
                            id="ifscCode"
                            value={ifscCode}
                            onChange={(e) => setIfscCode(e.target.value)}
                            required
                        />
                    </div>
                    <div className="modal-buttons">
                        <button type="submit">Submit</button>
                        <button type="button" onClick={closeModal}>Close</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
