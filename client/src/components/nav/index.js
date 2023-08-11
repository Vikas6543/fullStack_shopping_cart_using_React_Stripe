import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Nav = () => {
  const { cart } = useSelector((state) => state.products);
  const user = JSON.parse(localStorage.getItem('cart_stripe_user'));

  const navigate = useNavigate();

  return (
    <nav className='flex items-center justify-between bg-gray-200 py-3 px-12'>
      <div onClick={() => navigate('/')}>
        <p className='font-bold text-2xl cursor-pointer'>My Store</p>
      </div>

      {user && (
        <section
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '2rem',
          }}
        >
          <div
            className='relative cursor-pointer'
            onClick={() => navigate('/cart')}
          >
            <i className='fas fa-shopping-cart text-xl'></i>

            {cart.length > 0 && (
              <div className='absolute -top-2 -right-2 bg-red-500 text-white rounded-full px-1 text-xs'>
                {cart.length}
              </div>
            )}
          </div>

          <div
            className='relative cursor-pointer'
            onClick={() => {
              localStorage.removeItem('cart_stripe_user');
              navigate('/login');
            }}
          >
            <i className='fas fa-sign-out-alt text-xl'></i>
          </div>
        </section>
      )}
    </nav>
  );
};

export default Nav;
