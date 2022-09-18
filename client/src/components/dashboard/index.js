import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import ProductCard from './ProductCard';

const Dashboard = () => {
  const [apiData, setApiData] = useState([]);
  const [textInput, setTextInput] = useState('');

  const dispatch = useDispatch();
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

  useEffect(() => {
    fetchProducts();
  }, [textInput]);

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
        <section className='col-span-9 ml-3'>
          <ProductCard products={apiData} addToCart={addToCart} />
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
