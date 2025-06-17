import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { backendUrl } from '../App'

const Edit = ({ token }) => {
  const { id } = useParams(); // Lấy ID sản phẩm từ URL
  const navigate = useNavigate();

  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    subCategory: "",
    bestseller: false,
    sizes: [],
    image: [],
  });

  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [image3, setImage3] = useState(null);
  const [image4, setImage4] = useState(null);

  // Fetch thông tin sản phẩm hiện tại
  useEffect(() => {
    const fetchProduct = async () => {
        if (!id) {
            toast.error("Product ID is missing.");
            return;
        }

        console.log("Sending productId:", id); // Log để kiểm tra

        try {
            const response = await axios.post(
                backendUrl + '/api/product/single',
                { productId: id },
                { headers: { token } }
            );
            if (response.data.success) {
                setProductData(response.data.product);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch product data.");
        }
    };

    fetchProduct();
}, [id, token]);

  // Xử lý khi submit form
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("id", id);
      formData.append("name", productData.name);
      formData.append("description", productData.description);
      formData.append("price", productData.price);
      formData.append("category", productData.category);
      formData.append("subCategory", productData.subCategory);
      formData.append("bestseller", productData.bestseller);
      formData.append("sizes", JSON.stringify(productData.sizes));

      image1 && formData.append("image1", image1);
      image2 && formData.append("image2", image2);
      image3 && formData.append("image3", image3);
      image4 && formData.append("image4", image4);

      const response = await axios.post(
        backendUrl + '/api/product/update',
        formData,
        {
          headers: {
            token: token
          }
        }
      );

      if (response.data.success) {
        toast.success("Product updated successfully!");
        navigate("/list");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update product.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSizeChange = (size) => {
    setProductData((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((item) => item !== size)
        : [...prev.sizes, size],
    }));
  };

  return (
    <form onSubmit={onSubmitHandler} className="flex flex-col w-full items-start gap-3">
      <div>
        <p className="mb-2">Upload Image</p>
        <div className="flex gap-2">
          {[image1, image2, image3, image4].map((image, index) => (
            <label key={index} htmlFor={`image${index + 1}`}>
              <img
                className="w-20 cursor-pointer"
                src={
                  image
                    ? URL.createObjectURL(image)
                    : productData.image?.[index] || "/placeholder.png"
                }
                alt=""
              />
              <input
                type="file"
                id={`image${index + 1}`}
                hidden
                onChange={(e) => {
                  const setImage = [setImage1, setImage2, setImage3, setImage4][index];
                  setImage(e.target.files[0]);
                }}
              />
            </label>
          ))}
        </div>
      </div>

      <div className="w-full">
        <p className="mb-2">Product Name</p>
        <input
          name="name"
          value={productData.name}
          onChange={handleInputChange}
          className="w-full max-w-[500px] px-3 py-2"
          type="text"
          placeholder="Type here"
          required
        />
      </div>

      <div className="w-full">
        <p className="mb-2">Product Description</p>
        <textarea
          name="description"
          value={productData.description}
          onChange={handleInputChange}
          className="w-full max-w-[500px] px-3 py-2"
          placeholder="Write content here"
          required
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-2 w-full sm:gap-8">
        <div>
          <p className="mb-2">Product Category</p>
          <select
            name="category"
            value={productData.category}
            onChange={handleInputChange}
            className="w-full px-3 py-2"
          >
            <option value="Arknights">Arknights</option>
            <option value="Honkai: Star Rail">Honkai: Star Rail</option>
            <option value="Others">Others</option>
          </select>
        </div>

        <div>
          <p className="mb-2">Sub Category</p>
          <select
            name="subCategory"
            value={productData.subCategory}
            onChange={handleInputChange}
            className="w-full px-3 py-2"
          >
            <option value="Available">Available</option>
            <option value="OutOfStock">Out of Stock</option>
          </select>
        </div>

        <div>
          <p className="mb-2">Product Price</p>
          <input
            name="price"
            value={productData.price}
            onChange={handleInputChange}
            className="w-full px-3 py-2 sm:w-[120px]"
            type="number"
            placeholder="25"
          />
        </div>
      </div>

      <div>
        <p className="mb-2">Product Sizes</p>
        <div className="flex gap-3">
          {["S", "M", "L", "XL", "XXL"].map((size) => (
            <div key={size} onClick={() => handleSizeChange(size)}>
              <p
                className={`${
                  productData.sizes.includes(size) ? "bg-pink-100" : "bg-slate-200"
                } px-3 py-1 cursor-pointer`}
              >
                {size}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-2 mt-2">
        <input
          type="checkbox"
          id="bestseller"
          checked={productData.bestseller}
          onChange={() =>
            setProductData((prev) => ({ ...prev, bestseller: !prev.bestseller }))
          }
        />
        <label className="cursor-pointer" htmlFor="bestseller">
          Add to bestseller
        </label>
      </div>

      <button type="submit" className="w-28 py-3 mt-4 bg-black text-white">
        UPDATE
      </button>
    </form>
  );
};

export default Edit;