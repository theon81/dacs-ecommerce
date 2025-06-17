import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { backendUrl, currency } from '../App';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash } from 'react-icons/fa'; 
import Swal from 'sweetalert2'

const List = ({ token }) => {
  const [list, setList] = useState([]);

  const fetchList = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/product/list');
      if (response.data.success) {
        setList(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const removeProduct = async (id) => {
    try {
      const response = await axios.post(
        backendUrl + '/api/product/remove/',
        { id },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        await fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const navigate = useNavigate();

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <>
      <p className="mb-2">All Products List</p>
      <div className="flex flex-col gap-2">
        {/* ------- List Table Title ------- */}
        <div className="hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-1 px-2 border bg-gray-100 text-sm">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b className="text-center">Action</b>
        </div>

        {/* ------- Products List ------- */}
        {list.map((item, index) => (
          <div
            className="grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center gap-2 py-1 px-2 border text-sm"
            key={index}
          >
            <img className="w-12" src={item.image[0]} alt="" />
            <p>{item.name}</p>
            <p>{item.category}</p>
            <p>
              {currency}
              {item.price}
            </p>
            <div className="flex justify-center gap-2">
              {/* Edit Icon */}
              <button
                onClick={() => navigate(`/edit/${item._id}`)}
                className="text-black hover:text-gray-700"
              >
                <FaEdit size={18} />
              </button>
              {/* Delete Icon */}
              <button
                onClick={async () => {
                  const result = await Swal.fire({
                    title: 'Are you sure?',
                    text: "You won't be able to revert this!",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#000',      // Nút OK màu đen
                    cancelButtonColor: '#fff',       // Nút Cancel màu trắng
                    confirmButtonText: 'Yes, delete it!',
                    cancelButtonText: 'Cancel',
                    background: '#fff',              // Nền trắng
                    color: '#222',                   // Chữ đen
                    customClass: {
                      popup: 'swal2-smaller',        // Thêm class cho popup nhỏ lại
                      confirmButton: 'swal2-confirm-custom',
                      cancelButton: 'swal2-cancel-custom'
                    }
                  });
                  if (result.isConfirmed) {
                    removeProduct(item._id);
                  }
                }}
                className="text-black hover:text-gray-700"
              >
                <FaTrash size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default List;
