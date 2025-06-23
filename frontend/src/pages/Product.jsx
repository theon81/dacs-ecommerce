import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import RelatedProducts from '../components/RelatedProducts';

const Product = () => {

  const { productId } = useParams();
  const { products, currency, addToCart } = useContext(ShopContext);
  const [productData, setProductData] = useState(false);
  const [image, setImage] = useState('');
  const [size, setSize] = useState('');

  const fetchProductData = async () => {
      
    products.map((item)=>{
      if (item._id === productId) {
        setProductData(item)
        console.log(item);
        setImage(item.image[0]);
        return null;
      }
    })

  }

  useEffect(()=>{
    fetchProductData();
  }, [productId, products])

  const sizeOrder = ['S', 'M', 'L', 'XL', 'XXL'];

  return productData ? (
    <div className='border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100'>
      {/* product data */}
      <div className='flex gap-12 sm:gap-12 flex-col sm:flex-row'>
          
        {/* prod images */}
        <div className='flex-1 flex flex-col-reverse gap-3 sm:flex-row'>
          <div 
          className='flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal w-full sm:w-[18.7%]'>
            {
              productData.image.map((item, index)=>(
                <img onClick={()=>setImage(item)}
                src={item} 
                key={index} 
                className='w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer' alt="" />
              ))
            }
          </div>
          <div className='w-full sm:w-[80%]'>
            <img className='w-full h-auto' src={image} alt="" />
          </div>
        </div>

        {/* prod details */}
        <div className='flex-1 '>
            <h1 className='font-medium text-2xl mt-2 text-[#352F44]'>{productData.name}</h1>
            <div className='flex items-center gap-1 mt-2'>
              <img src={assets.star_icon} alt="" className="w-3 5" />
              <img src={assets.star_icon} alt="" className="w-3 5" />
              <img src={assets.star_icon} alt="" className="w-3 5" />
              <img src={assets.star_icon} alt="" className="w-3 5" />
              <img src={assets.star_dull_icon} alt="" className="w-3 5" />
              <p className='pl-2 text-[#5C5470]'>(267)</p>
            </div>
            <p className='mt-5 text-3xl font-medium text-[#352F44]'>
              {productData.price}{currency}
            </p>
            <p className='mt-5 text-[#352F44] md:w-4/5'>
              {productData.description}
            </p>
            <div className='flex flex-col gap-4 my-8 '>
              <p className='text-[#5C5470]'>Select Size</p>
              <div className='flex gap-2'>
                {[...productData.sizes]
                  .sort((a, b) => sizeOrder.indexOf(a) - sizeOrder.indexOf(b))
                  .map((item, index) => (
                    <button
                      onClick={() => setSize(item)}
                      className={`border-4 border-[#5C5470] py-2 px-4 text-[#352F44] ${item === size ? 'bg-[#5C5470] text-[#FAF0E6]' : ''}`}
                      key={index}
                    >
                      {item}
                    </button>
                  ))}
              </div>
            </div>
                
            <button 
              onClick={() => addToCart(productData._id, size)} 
              className={`py-3 px-8 text-sm text-[#181D31] ${productData.subCategory === 'OutOfStock' ? 'bg-[#B9B4C7] cursor-not-allowed' : 'bg-[#5C5470] text-[#FAF0E6] active:bg-[#352F44] active:text-[#FAF0E6]'}`}
              disabled={productData.subCategory === 'OutOfStock'}
            >
              {productData.subCategory === 'OutOfStock' ? 'OUT OF STOCK' : 'ADD TO CART'}
            </button>
            <hr className='mt-8 sm:w-4/5' />
            <div className='text-sm text-[#5C5470] mt-5 flex flex-col gap-1'>
                <p>100% Original product.</p>
                <p>Cash on delivery is available on this product.</p>
                <p>Easy return and exchange policy within 7 days.</p>
            </div>
        </div>
      </div>

      {/* desc and review */}
      <div className='mt-20'>
        <div className='flex'>
          <b className='border border-[#352F44] px-5 py-3 text-sm text-[#5C5470]'>
            Description
          </b>
          <p className='border border-[#352F44] px-5 py-3 text-sm text-[#5C5470]'>
            Reviews (7)
          </p>
        </div>
        <div className='flex flex-col gap-4 border border-[#352F44] px-6 py-6 text-sm text-[#5C5470]'>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. 
            Hic numquam fugit quasi, est impedit asperiores repellat vel ipsa esse at ullam commodi, 
            facilis porro adipisci minima sint, quam reiciendis excepturi.
          </p>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. 
            Ducimus incidunt quibusdam, nihil itaque doloribus perspiciatis. 
            Officiis blanditiis quaerat dolores placeat! 
            Placeat labore nihil numquam saepe, a iste deleniti! Veritatis, doloribus!
          </p>
        </div>
      </div>

      {/* related products */}
      <RelatedProducts category={productData.category} />

    </div>
  ) : <div className='opacity-0'></div>
}

export default Product
