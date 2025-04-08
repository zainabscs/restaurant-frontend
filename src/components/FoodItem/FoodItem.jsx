import React, { useContext } from 'react'
import './FoodItem.css'
import { assets } from '../../assets/frontend_assets/assets'
import { StoreContext } from '../../Context/StoreContext';
import { toast } from 'react-toastify';

const FoodItem = ({ id, name, price, description, image }) => {
  const { cartItems, addToCart, removeFromCart, url } = useContext(StoreContext);

  const quantity = cartItems?.[id] || 0; // ✅ safely access quantity

  return (
    <div className='food-item'>
      <div className="food-item-img-container">
        <img className='food-item-img' src={image} alt={name} />
        {quantity === 0 ? (
          <img
            className='add'
            onClick={() => {
              addToCart(id);
              toast.success(`${name} added to cart`);
            }}
            src={assets.add_icon_white}
            alt=""
          />
        ) : (
          <div className='food-item-counter'>
            <img
              onClick={() => {
                removeFromCart(id);
                toast.error(`${name} removed from cart`);
              }}
              src={assets.remove_icon_red}
              alt=""
            />
            <p>{quantity}</p>
            <img
              onClick={() => {
                addToCart(id);
                toast.success(`${name} added to cart`);
              }}
              src={assets.add_icon_green}
              alt=""
            />
          </div>
        )}
      </div>
      <div className="food-item-info">
        <div className="food-item-name-rating">
          <p>{name}</p>
          <img src={assets.rating_starts} alt="" />
        </div>
        <p className="food-item-description">{description}</p>
        <p className='food-item-price'>${price}</p>
      </div>
    </div>
  )
}

export default FoodItem;
