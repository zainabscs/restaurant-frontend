import React, { useContext, useEffect } from 'react';
import './Verify.css';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { StoreContext } from '../../Context/StoreContext';
import Axios from 'axios';

const Verify = () => {
    const [searchParams] = useSearchParams();
    const success = searchParams.get("success");
    const orderId = searchParams.get("orderId");
    const { url } = useContext(StoreContext);
    const navigate = useNavigate();

    const verifyPayment = async (token) => {
        try {
            console.log("Backend URL:", url);
            const response = await Axios.post(
                url + "/api/order/verify",
                { success, orderId },
                {
                    headers: {
                        "Content-Type": "application/json",
                        token: token,
                    },
                }
            );
    
            console.log("API Response:", response.data);
            console.log("Token being sent:", token);
            if (response.data.success) {
                navigate("/myorders");
            } else {
                alert("Payment verification failed. " + (response.data.message || ""));
                navigate("/");
            }
        } catch (error) {
            console.error("Error verifying payment:", error);
            alert("Something went wrong during payment verification.");
            navigate("/");
        }
    };
    
    
    useEffect(() => {
        const tokenFromURL = searchParams.get("token");
        const tokenFromStorage = localStorage.getItem("token");
    
        // ✅ ADD THESE 3 LINES:
        console.log("✅ Token from URL:", tokenFromURL);
        console.log("✅ Token from localStorage:", tokenFromStorage);
        console.log("✅ Final token used:", tokenFromURL || tokenFromStorage);
    
        if (tokenFromURL && !tokenFromStorage) {
            localStorage.setItem("token", tokenFromURL);
        }
    
        const token = tokenFromURL || tokenFromStorage;
    
        if (!token) {
            console.warn("No token found. Redirecting to login...");
            alert("Session expired. Please login again.");
            navigate("/login");
            return;
        }
    
        verifyPayment(token); // ✅ Pass token
    }, []);
    
    
    return (
        <div className='verify'>
            <div className="spinner"></div>
        </div>
    );
};

export default Verify;
