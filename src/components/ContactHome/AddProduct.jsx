import React, { useState } from "react";
import InputField from "../../InputField";
import CommonButton from "../../CommonButton";
import { Rating } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import { XIcon } from "@heroicons/react/solid";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";

const AddProduct = ({ addManualProduct, onCancel }) => {
  const [products, setProducts] = useState([createEmpty()]);

  function createEmpty() {
    return {
      id: uuidv4(),
      Productname: "",
      price: "",
      description: "",
      image: "",
      rating: 0,
      category: "",
    };
  }

  const handleChange = (e, idx) => {
    const { name, value } = e.target;
    setProducts((prev) =>
      prev.map((p, i) => (i === idx ? { ...p, [name]: value } : p))
    );
  };

  const handleRating = (e, val, idx) => {
    setProducts((prev) =>
      prev.map((p, i) => (i === idx ? { ...p, rating: val || 0 } : p))
    );
  };

  const handleImage = (e, idx) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result;

      setProducts((prev) =>
        prev.map((p, i) => (i === idx ? { ...p, image: dataUrl } : p))
      );
    };
    reader.readAsDataURL(file);
  };

  const addMore = () => setProducts((prev) => [...prev, createEmpty()]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const allFilled = products.every(
      (p) =>
        p.Productname &&
        p.price &&
        p.rating > 0 &&
        p.description &&
        p.category &&
        p.image
    );
    if (!allFilled) return toast.warn("Fill all fields!");
    addManualProduct(products);
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center overflow-auto p-4 z-50">
      <form
        onSubmit={handleSubmit}
        className=" bg-white rounded-xl shadow-xl w-full max-w-xl  h-[75vh] max-h-[75vh]  p-6 space-y-6 overflow-y-auto z-50">
          
        {products.map((prod, i) => (
          <div key={prod.id} className="border-b pb-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Product #{i + 1}</h3>
              {products.length > 1 && (
                <button
                  type="button"
                  onClick={() =>
                    setProducts((prev) => prev.filter((_, idx) => idx !== i))
                  }
                  className="text-red-500 hover:text-red-700"
                >
                  <XIcon className="h-6 w-6" />
                </button>
              )}
            </div>

            <div className="flex gap-4">
              <InputField
                label="Product Name :"
                type="text"
                name="Productname"
                placeholder="eg: Apple earpods"
                value={prod.Productname}
                onChange={(e) => handleChange(e, i)}
              />
              <InputField
                label="Product Price (₹) :"
                placeholder="Price"
                type="number"
                name="price"
                value={prod.price}
                onChange={(e) => handleChange(e, i)}
              />
            </div>

            <div className="flex gap-4 items-end">
              <div className="flex flex-col flex-1">
                <label className="font-medium mb-1">Product Category:</label>
                <input
                  type="text"
                  name="category"
                  placeholder="Product Category"
                  value={prod.category}
                  onChange={(e) => handleChange(e, i)}
                  className="border  px-2 py-1 w-53"
                />
              </div>

              
              <div className="flex flex-col justify-end mr-32">
                <label className="font-medium mb-1 flex">Product Rating :</label>
                <Rating
                  name="rating"
                  precision={0.5}
                  value={prod.rating}
                  icon={<StarIcon fontSize="inherit" />}
                  emptyIcon={
                    <StarIcon fontSize="inherit" style={{ opacity: 0.3 }} />
                  }
                  onChange={(e, v) => handleRating(e, v, i)}
                  className="border border-black p-1"
                />
              </div>
            </div>

            <div className="mt-1">
              <InputField
                label="Product Description :"
                type="textarea"
                placeholder="Product Description"
                name="description"
                value={prod.description}
                onChange={(e) => handleChange(e, i)}
                className="mt-0"
              />
            </div>

            <div className="flex flex-col gap-2 mt-4">
              <label className="text-sm font-medium">Upload Image</label>
              <div className="relative w-full h-50 bg-gray-100 border border-dashed border-gray-400 rounded-lg overflow-hidden cursor-pointer group">
                <input
                  type="file"
                  onChange={(e) => handleImage(e, i)}
                  className="absolute inset-0 opacity-0 cursor-pointer z-10"
                />

                {prod.image ? (
                  <img
                    src={prod.image}
                    alt="preview"
                    className="w-150 h-50 object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm z-0">
                    Click to upload image
                  </div>
                )}
              </div>

              <span className="text-sm text-gray-600">
                {prod.image ? "Image Preview" : "No image selected"}
              </span>
            </div>
          </div>
        ))}

        <div className="flex justify-end gap-3 pt-4">
          <CommonButton
            type="button"
            onClick={addMore}
            label="Add New"
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          />
          <CommonButton
            type="submit"
            label="Submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          />
          <CommonButton
            type="button"
            onClick={onCancel}
            label="Cancel"
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
          />
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
