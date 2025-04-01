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

    const verifyPayment = async () => {
        try {
            console.log("Verifying payment with success:", success, "orderId:", orderId); // Debug log

            const response = await Axios.post(url + "/api/order/verify", { success, orderId }, {
                headers: {
                    token: localStorage.getItem("token") // Assuming you're storing the token in localStorage
                }
            });
            console.log("API Response:", response.data); // Debug log for API response

            if (response.data.success) {
                navigate("/myorders");
            } else {
                console.log("Error:", response.data.message || "Unknown error");
                // You can navigate to an error page or display a message
                // navigate("/"); 
            }
        } catch (error) {
            console.error("Payment verification failed:", error);
            navigate("/"); // Navigate to a safe fallback if there's an error.
        }
    };

    useEffect(() => {
        verifyPayment();
    }, [success, orderId]);

    return (
        <div className='verify'>
            <div className="spinner"></div>
        </div>
    );
};

export default Verify;
