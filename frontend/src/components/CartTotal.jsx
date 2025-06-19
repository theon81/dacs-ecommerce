import React from 'react'
import { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title';

const CartTotal = () => {

    const { currency, delivery_fee, getCartAmount } = useContext(ShopContext);

  return (
    <div className='w-full'>
        <div className='text-2xl'>
            <Title text1={'CART'} text2={'TOTALS'}/>
        </div>

        <div className='flex flex-col gap-2 mt-2 text-sm'>
            <div className='flex justify-between text-[#5C5470]'>
                <p>Subtotal</p>
                <p>{getCartAmount()} {currency}</p>
            </div>
            <hr className='border-[#352F44]'/>
            <div className='flex justify-between text-[#5C5470]'>
                <p>Shipping Fee</p>
                <p>{delivery_fee} {currency}</p>
            </div>
            <hr className='border-[#352F44]'/>
            <div className='flex justify-between text-[#5C5470]'>
                <b>Total</b>
                <b>{getCartAmount() === 0 ? 0 : getCartAmount() + delivery_fee} {currency}</b>
            </div>
        </div>
    </div>
  )
}

export default CartTotal
