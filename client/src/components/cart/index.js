import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Axios from 'axios';

const Cart = () => {
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cart } = useSelector((state) => state.products);
  const user = JSON.parse(localStorage.getItem('cart_stripe_user'));

  const cartTotal = () => {
    return cart.reduce((total, product) => {
      return Math.ceil(total + product.price * product.cartQty);
    }, 0);
  };

  const addQty = (id) => {
    dispatch({ type: 'ADD_QUANTITY', payload: id });
  };

  const removeQty = (id) => {
    dispatch({ type: 'REMOVE_QUANTITY', payload: id });
  };

  const deleteCart = (product) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: product });
  };

  const checkoutHandler = async () => {
    setLoading(true);

    try {
      const result = await Axios.post(
        'http://localhost:5000/payment/checkout',
        {
          id: user.user._id,
          cart,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: user.token,
          },
        }
      );
      if (result?.data?.url) {
        setLoading(false);
        window.open(result?.data?.url, '_blank');
      }
    } catch (error) {
      alert(error.response.data.message);
      setLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, []);

  return (
    <div className='mx-4 md:mx-24 lg:mx-44 mt-8'>
      {cart.length > 0 ? (
        <div>
          <h3 className='text-xl font-bold tracking-wider text-center'>
            {cart.length} items in your cart
          </h3>

          {/* cart table */}
          <section>
            <table className='w-full border shadow mt-2'>
              <thead>
                <tr className='bg-gray-100'>
                  <th className='px-6 py-3 font-bold whitespace-nowrap'>
                    Image
                  </th>
                  <th className='px-6 py-3 font-bold whitespace-nowrap hidden md:block'>
                    Product
                  </th>
                  <th className='px-6 py-3 font-bold whitespace-nowrap'>Qty</th>
                  <th className='px-6 py-3 font-bold whitespace-nowrap'>
                    Price
                  </th>
                  <th className='px-6 py-3 font-bold whitespace-nowrap'>
                    Remove
                  </th>
                </tr>
              </thead>

              <tbody>
                {cart.map((product) => (
                  <tr key={product.id}>
                    {/* product image */}
                    <td>
                      <div className='flex justify-center my-3'>
                        <img
                          src={product.image}
                          className='object-cover h-full w-12 md:w-20 rounded-xl'
                          alt='cart_image'
                        />
                      </div>
                    </td>

                    {/* product name  */}
                    <td className='p-4 px-6 text-center whitespace-nowrap hidden md:inline'>
                      <div className='flex flex-col items-center justify-center'>
                        <h3>{product.title.substr(0, 18) + '...'}</h3>
                      </div>
                    </td>

                    {/* product Quantity */}
                    <td className='p-4 px-6 text-center whitespace-nowrap'>
                      <button onClick={() => removeQty(product.id)}>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          className='inline-flex w-6 h-6 text-red-600'
                          fill='none'
                          viewBox='0 0 24 24'
                          stroke='currentColor'
                        >
                          <path
                            stroke-linecap='round'
                            stroke-linejoin='round'
                            stroke-width='2'
                            d='M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z'
                          />
                        </svg>
                      </button>
                      <span className='px-1 font-semibold'>
                        {product.cartQty}
                      </span>
                      <button onClick={() => addQty(product.id)}>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          className='inline-flex w-6 h-6 text-green-600'
                          fill='none'
                          viewBox='0 0 24 24'
                          stroke='currentColor'
                        >
                          <path
                            stroke-linecap='round'
                            stroke-linejoin='round'
                            stroke-width='2'
                            d='M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z'
                          />
                        </svg>
                      </button>
                    </td>

                    {/* product price */}
                    <td className='p-4 px-6 text-center whitespace-nowrap'>
                      ₹{Math.ceil(product.price)}
                    </td>

                    {/* product delete button */}
                    <td className='p-4 px-6 text-center whitespace-nowrap'>
                      <button onClick={() => deleteCart(product.id)}>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          className='w-6 h-6 text-red-400'
                          fill='none'
                          viewBox='0 0 24 24'
                          stroke='currentColor'
                        >
                          <path
                            stroke-linecap='round'
                            stroke-linejoin='round'
                            stroke-width='2'
                            d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
                          />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          {/* cart total */}
          <section className='mt-6'>
            <div className='rounded-md border p-3'>
              <div
                className='
            flex
            items-center
            justify-between
            px-3
            py-1
          '
              >
                <span className='text-xl font-bold'>Total</span>
                <span className='text-2xl font-bold'>₹{cartTotal()}</span>
              </div>
            </div>

            {/* checkout */}
            <div className='mt-4'>
              <button
                onClick={checkoutHandler}
                className='
          w-full
          py-2
          text-center text-white
          bg-blue-500
          rounded-md
          shadow
          hover:bg-blue-600
        '
              >
                {loading ? 'please wait...' : 'Proceed to Checkout'}
              </button>
            </div>
          </section>
        </div>
      ) : (
        <span className='flex justify-center items-center flex-col mt-32 text-2xl'>
          Your cart is empty.
          <Link to='/'>
            <button className='border mt-2 rounded px-3 bg-gray-800 text-white flex items-center'>
              <span>Continue Shopping</span>
              <span>
                <i className='fa-solid fa-arrow-right pl-2'></i>
              </span>
            </button>
          </Link>
        </span>
      )}
    </div>
  );
};

export default Cart;
