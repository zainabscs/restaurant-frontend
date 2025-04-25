import React, { useContext, useEffect } from 'react';
import './Placeorder.css';
import { useNavigate } from 'react-router-dom';
import { StoreContext } from '../../Context/StoreContext';
import axios from 'axios';

function Placeorder() {
  const navigate = useNavigate();
  const { getTotalCartAmount, token, food_list, cartItems, url } = useContext(StoreContext);

  const placeOrder = async (event) => {
    event.preventDefault();

    let orderItems = [];
    food_list.map((item) => {
        if (cartItems[item._id] > 0) {
            let itemInfo = item;
            itemInfo["quantity"] = cartItems[item._id];
            orderItems.push(itemInfo);
        }
    });

    let orderData = {
        items: orderItems,
        amount: getTotalCartAmount() + 2, // Adding delivery fee
        address:""
    };

    console.log("Sending order data to backend:", orderData);

    try {
        const response = await axios.post(url + "/api/order/place", orderData, { headers: { token } });

        console.log("Response from backend:", response); // Log full response object

        if (response.data.success) {
            const { session_url } = response.data;
            console.log("Session URL:", session_url); // Check if the session URL is received
            if (session_url) {
                console.log("Redirecting to session...");
                window.location.replace(session_url);
            } else {
                alert("Session URL is missing or invalid.");
                console.error("Session URL is missing in the response.");
            }
        } else {
            console.error("Error message from backend:", response.data.message);
            alert("Error: " + response.data.message || "Something went wrong.");
        }
    } catch (error) {
        console.error("Error placing order:", error);
        alert("An error occurred while placing the order.");
    }
  };

  useEffect(() => {
    if (!token) {
      navigate('/cart');
    } else if (getTotalCartAmount() === 0) {
      navigate('/cart');
    }
  }, [token, getTotalCartAmount, navigate]);

  return (
    <form onSubmit={placeOrder} className='place-order'>
      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>${getTotalCartAmount()} NZD</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>${getTotalCartAmount() === 0 ? 0 : getTotalCartAmount()} NZD</b>
            </div>
          </div>
          <button type='submit'>PROCEED TO CHECKOUT</button>
        </div>
      </div>
    </form>
  );
}

export default Placeorder;
