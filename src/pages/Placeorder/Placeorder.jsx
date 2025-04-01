import React, { useContext, useEffect, useState } from 'react'
import './Placeorder.css'
import { useNavigate } from 'react-router-dom';
import { StoreContext } from '../../Context/StoreContext'
import axios  from 'axios';
function Placeorder() {
  const navigate = useNavigate();

  const { getTotalCartAmount, token, food_list, cartItems, url } = useContext(StoreContext)

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: ""
  })

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData(data => ({ ...data, [name]: value }))
  }
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
        address: data,
        items: orderItems,
        amount: getTotalCartAmount() + 2,
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

    useEffect(()=>{
      if(!token){
        navigate('/cart');
      }
      else if(getTotalCartAmount()===0){
        navigate('/cart');
      }
    },[token])

  
  return (
    <form onSubmit={placeOrder} className='place-order' action="">
      <div className="place-order-left">
        <p className="title">Delivery Information</p>
        <div className="multi-fields">
          <input required name='firstName' onChange={onChangeHandler} value={data.firstName} type="text" placeholder='First Name' />
          <input required name='lastName' onChange={onChangeHandler} value={data.lastName} type="text" placeholder='Last Name' />
        </div>
        <input required name="email" onChange={onChangeHandler} value={data.email} type="email" placeholder='Email address' />
        <input required name="street" onChange={onChangeHandler} value={data.street} type="text" placeholder='Street' />
        <div className="multi-fields">
          <input required name="city" onChange={onChangeHandler} value={data.city} type="text" placeholder='City' />
          <input required name="state" onChange={onChangeHandler} value={data.state} type="text" placeholder='State' />
        </div>
        <div className="multi-fields">
          <input required name='zipcode' onChange={onChangeHandler} value={data.zipcode} type="text" placeholder='Zip code' />
          <input required name='country' onChange={onChangeHandler} value={data.country} type="text" placeholder='Country' />
        </div>
        <input required name='phone' onChange={onChangeHandler} value={data.phone} type="text" placeholder='phone' />
      </div>
      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>${getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>${getTotalCartAmount() === 0 ? 0 : 2}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>${getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 2}</b>
            </div>
          </div>
          <button type='submit'>PROCEED TO CHECKOUT</button>
        </div>
      </div>
    </form>
  )
}

export default Placeorder