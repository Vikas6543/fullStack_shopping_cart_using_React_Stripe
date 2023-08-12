import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { useSearchParams, useNavigate } from 'react-router-dom';
import ProductCard from './ProductCard';

const Dashboard = () => {
  const [apiData, setApiData] = useState([]);
  const [textInput, setTextInput] = useState('');
  const user = JSON.parse(localStorage.getItem('cart_stripe_user'));

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id = searchParams.get('session_id');
  toast.configure();

  const fetchProducts = async () => {
    try {
      const { data } = await Axios('https://fakestoreapi.com/products');

      if (textInput.length > 1) {
        const filteredProducts = data.filter((product) => {
          return (
            product.title.toLowerCase().includes(textInput.toLowerCase()) ||
            product.category.toLowerCase().includes(textInput.toLowerCase())
          );
        });
        setApiData(filteredProducts);
      } else {
        setApiData(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const verifyPayment = async () => {
    try {
      const { data } = await Axios.get(
        `https://react-cart-stripe.onrender.com/verify-payment/${id}`
      );
      toast.success(data.message);
      navigate('/');
    } catch (error) {
      toast.error(error.response.data);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [textInput]);

  useEffect(() => {
    if (id) {
      verifyPayment();
    }
  }, [id]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, []);

  const addToCart = (item) => {
    dispatch({ type: 'ADD_TO_CART', payload: item });
    toast.success('added to cart', {
      autoClose: 1500,
    });
  };

  return (
    <div>
      <div className='text-center my-6'>
        <input
          type='text'
          placeholder='Search...'
          className='border
          border-gray-400 rounded-lg py-1 px-3 outline-none'
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
        />
      </div>
      <div className='w-11/12 mx-auto'>
        {/* product card */}
        <section>
          <ProductCard products={apiData} addToCart={addToCart} />
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
