import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Nav = () => {
  const { cart } = useSelector((state) => state.products);

  const navigate = useNavigate();

  return (
    <nav className='flex items-center justify-between bg-gray-200 py-3 px-12'>
      <div onClick={() => navigate('/')}>
        <p className='font-bold text-lg cursor-pointer'>My Store</p>
      </div>
      <div
        className='relative cursor-pointer'
        onClick={() => navigate('/cart')}
      >
        <i className='fas fa-shopping-cart text-lg'></i>

        {cart.length > 0 && (
          <div className='absolute -top-2 -right-2 bg-red-500 text-white rounded-full px-1 text-xs'>
            {cart.length}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Nav;
