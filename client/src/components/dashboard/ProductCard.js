import React from 'react';
import { useSelector } from 'react-redux';
import LoadingSpinner from './LoadingSpinner';

const ProductCard = ({ products, addToCart }) => {
  const { cart } = useSelector((state) => state.products);

  return (
    <div className='grid grid-cols-12 gap-8 relative'>
      {products.length > 0 ? (
        products.map((product) => (
          <div
            key={product.id}
            className='col-span-6 md:col-span-4 lg:col-span-3 border shadow-lg p-4 rounded'
          >
            <div>
              <p className='p-1 text-center'>
                <strong>{product.title.substr(0, 18) + '...'}</strong>
              </p>
              <img className='border-b py-4 product-img' src={product.image} />
            </div>

            {/* Buttons */}
            <div className='flex items-center justify-between mt-5'>
              <div className='font-semibold text-sm'>
                ₹{Math.ceil(product.price)}
              </div>
              <div>
                {cart.find((item) => item.id == product.id) ? (
                  <button
                    disabled
                    className='bg-gray-500 hover:bg-gray-600 text-white md:py-1 md:px-3 p-2 rounded text-sm cart-btn cursor-not-allowed'
                  >
                    Added to Cart
                  </button>
                ) : (
                  <button
                    onClick={() => addToCart(product)}
                    className='bg-black hover:bg-gray-600 text-white md:py-1 md:px-3 p-2 rounded text-sm cart-btn'
                  >
                    Add to Cart
                  </button>
                )}
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className='absolute left-1/2 top-24'>
          <LoadingSpinner />
        </div>
      )}
    </div>
  );
};

export default ProductCard;
