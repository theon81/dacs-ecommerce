import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Edit = () => {
  const { id } = useParams(); // Get item ID from route
  const navigate = useNavigate();
  const [itemData, setItemData] = useState(null); // State to store item data
  const [loading, setLoading] = useState(true); // State to manage loading

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await axios.get(`/api/items/${id}`);
        setItemData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching item:', error);
        setLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/items/${id}`, itemData);
      navigate('/list'); // Redirect to list page after successful edit
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  const handleCancel = () => {
    navigate('/list'); // Navigate back to the list page
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!itemData) {
    return <p>Item not found.</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Item</h1>

      {/* Item Card */}
      <div className="flex items-center gap-4 p-4 border rounded mb-6">
        <img
          src={itemData.image}
          alt={itemData.name}
          className="w-24 h-24 object-cover border"
        />
        <div>
          <p className="text-lg font-bold">{itemData.name}</p>
          <p className="text-sm text-gray-600">{itemData.category}</p>
          <p className="text-sm text-gray-600">${itemData.price}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name Field */}
        <div>
          <label className="block text-sm font-medium">Name</label>
          <input
            type="text"
            value={itemData.name}
            onChange={(e) => setItemData({ ...itemData, name: e.target.value })}
            className="w-full border px-3 py-2"
            required
          />
        </div>

        {/* Category Field */}
        <div>
          <label className="block text-sm font-medium">Category</label>
          <input
            type="text"
            value={itemData.category}
            onChange={(e) => setItemData({ ...itemData, category: e.target.value })}
            className="w-full border px-3 py-2"
            required
          />
        </div>

        {/* Price Field */}
        <div>
          <label className="block text-sm font-medium">Price</label>
          <input
            type="number"
            value={itemData.price}
            onChange={(e) => setItemData({ ...itemData, price: e.target.value })}
            className="w-full border px-3 py-2"
            required
          />
        </div>

        {/* Submit and Cancel Buttons */}
        <div className="flex gap-4">
          <button
            type="submit"
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Save Changes
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default Edit;