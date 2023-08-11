import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await Axios.post('http://localhost:5000/user/login', {
        email,
        password,
      });
      if (data) {
        localStorage.setItem('cart_stripe_user', JSON.stringify(data));
        navigate('/');
      }
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  return (
    <div className='w-8/12 md:w-4/12 mx-auto mt-12'>
      <form onSubmit={submitHandler} className='border shadow-xl p-8'>
        <p className='text-center font-semibold pb-6 text-2xl'>Login</p>
        <div>
          <div className='mb-3'>
            <input
              type='email'
              autoComplete='email'
              className='w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring focus:ring-gray-200'
              placeholder='Email address'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className='relative'>
            <label htmlFor='password' className='sr-only'>
              Password
            </label>
            <input
              type='password'
              className='w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring focus:ring-gray-200'
              placeholder='Password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && (
            <p className='text-red-500 text-sm pt-1 font-semibold'>{error}</p>
          )}
        </div>

        <div className='mt-3 text-sm text-gray-500 font-semibold'>
          <Link to='/register'>Don't have an account</Link>
        </div>

        <div className='mt-4'>
          <button
            type='submit'
            className='group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gray-800  focus:outline-none'
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
