import React, { useEffect, useState } from 'react';
import Card from '../../Card/Card';
import CommonButton from '../../CommonButton';
import { useCart } from '../../CartContext';
import { useNavigate } from 'react-router-dom';
import Pagination from '../Pagination';
import AddProduct from './AddProduct';
import { fetchProducts } from './Services';
import { v4 as uuidv4 } from 'uuid';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence, number } from 'framer-motion';
import Customerreview from '../../Filters/Customer review';
import Category from '../../Filters/Category';
import Search from '../../Filters/Search';
import { useAuth } from '../../AuthContext';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { toast } from 'react-toastify';

function ProductList() {
  const { addToCart, cartItems, removeFromCartById } = useCart();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [apiProducts, setApiProducts] = useState([]);
  const [manualProducts, setManualProducts] = useState(() => {
    const saved = localStorage.getItem('manualProducts');
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedProducts, setSelectedProducts] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedcategory, setSelectedCategory] = useState('');
  const [selectedRating, setSelectedRating] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const allProducts = [...manualProducts, ...apiProducts];

  const allPrices = allProducts.map((p) => p.price);

  const minProductPrice = Math.min(...allPrices);
  const maxProductsPrice = Math.max(...allPrices);

  const cancelPrice = () => {
    setMinPrice('');
    setMaxPrice('');
  };

  const filteredProducts = allProducts.filter((p) => {
    const productRating = p.rating.rate || p.rating;
    const title = (p.title || p.Productname || '').toLowerCase();
    const category = (p.category || '').toLowerCase();
    const query = searchQuery.toLowerCase().trim();

    const matchesSearch =
      query === '' || title.includes(query) || category.includes(query);

    return (
      matchesSearch &&
      (!selectedcategory || p.category === selectedcategory) &&
      (!selectedRating || productRating >= selectedRating) &&
      (!maxPrice || p.price <= maxPrice) &&
      (!minPrice || p.price >= minPrice)
    );
  });

  useEffect(() => {
    const totalPages = Math.ceil(filteredProducts.length / postsPerPage);
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [filteredProducts.length, currentPage, postsPerPage]);

  const visible = filteredProducts.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  );

  useEffect(() => {
    localStorage.setItem('manualProducts', JSON.stringify(manualProducts));
  }, [manualProducts]);

  useEffect(() => {
    setLoading(true);
    fetchProducts(150)
      .then((data) => setApiProducts(data))
      .catch((err) => setError(err))
      .finally(() => {
        setTimeout(() => {
          setLoading(false);
        }, 3000);
      });
  }, []);

  const toggleSelect = (id) => {
    setSelectedProducts((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const deleteSelected = () => {
    const ids = Object.keys(selectedProducts).filter(
      (id) => selectedProducts[id]
    );
    if (ids.length === 0) return;

    setManualProducts((prev) => prev.filter((p) => !ids.includes(p.id)));
    setApiProducts((prev) => prev.filter((p) => !ids.includes(String(p.id))));
    setSelectedProducts({});
  };

  const deleteProducts = (id) => {
    setManualProducts((prev) => prev.filter((p) => p.id !== id));
    setApiProducts((prev) => prev.filter((p) => p.id !== id));
    removeFromCartById(id);
    toast.warn('Product Deleted');
    setSelectedProducts((prev) => {
      const newSel = { ...prev };
      delete newSel[id];
      return newSel;
    });
  };

  const addManualProduct = (productsArray) => {
    const withIds = productsArray.map((prod) => ({ ...prod, id: uuidv4() }));
    setManualProducts((prev) => [...withIds, ...prev]);
    toast.success(
      `${productsArray.length} ${productsArray.length > 1 ? 'Products Added' : 'Product Added'} `
    );
    setShowAddForm(false);
  };

  if (loading)
    return (
      <div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
          {Array(postsPerPage)
            .fill()
            .map((_, i) => (
              <div key={i}>
                <Skeleton rectangle width={200} height={150} />
                <Skeleton width="50%" />
                <Skeleton count={5} />
              </div>
            ))}
        </div>
      </div>
    );

  if (error) return <div>Error: {error.message}</div>;

  const allVisibleSelected =
    visible.length > 0 && visible.every((p) => selectedProducts[p.id]);

  const getUniqueCategories = (products) => [
    ...new Set(products.map((p) => p.category)),
  ];

  return (
    <>
      <div className=" bg-gray-800/90 backdrop-filter backdrop-blur-sm flex flex-wrap items-center justify-between py-1 px-3 mb-4 gap-4 /* Use gap for consistent spacing ">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex flex-col">
            <Category
              selectedcategory={selectedcategory}
              setSelectedCategory={setSelectedCategory}
              setCurrentPage={setCurrentPage}
              getUniqueCategories={getUniqueCategories}
              allProducts={allProducts}
            />
          </div>

          <Search searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

          <div className="mt-4 flex flex-col space-y-1">
            <label className="font-medium text-sm text-white">Price:</label>
            <div className="flex items-center space-x-1 ">
              <input
                type="number"
                min={minProductPrice}
                value={minPrice}
                onChange={(e) => {
                  setMinPrice(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Min"
                className="w-20 px-2 py-1 bg-gray-700 border border-gray-600 rounded text-sm text-white focus:ring-indigo-500"
              />
              <input
                type="number"
                max={maxProductsPrice}
                value={maxPrice}
                onChange={(e) => {
                  setMaxPrice(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Max"
                className="w-20 px-2 py-1 bg-gray-700 border border-gray-600 rounded text-sm text-white focus:ring-indigo-500"
              />
            </div>
            <button
              onClick={cancelPrice}
              className="self-start text-sm text-indigo-300 hover:text-indigo-100 "
            >
              Clear
            </button>
          </div>

          <Customerreview
            selectedRating={selectedRating}
            setSelectedRating={setSelectedRating}
          />
        </div>

        {user.Type === 'Admin' && (
          <div className="flex items-center space-x-1 mr-10">
            <CommonButton
              label="Delete Selected"
              onClick={deleteSelected}
              className="bg-red-600 hover:bg-red-700 px-2 py-1 text-m text-white"
            />
            <CommonButton
              label="Add Product"
              onClick={() => setShowAddForm(true)}
              className="bg-indigo-600 hover:bg-indigo-700 px-2 py-1 text-m text-white"
            />
            <div className="ml-6 flex flex-col items-center text-xs">
              <input
                type="checkbox"
                checked={allVisibleSelected}
                onChange={() => {
                  const newSel = visible.reduce((acc, p) => {
                    acc[p.id] = !allVisibleSelected;
                    return acc;
                  }, {});
                  setSelectedProducts(newSel);
                }}
                className="h-4 w-4 accent-indigo-400"
              />
              <span className="text-white mt-6 fixed ml-2 mr-4">
                {allVisibleSelected ? 'Unselect All' : 'Select All'}
              </span>
            </div>
          </div>
        )}
      </div>

      {showAddForm && (
        <AddProduct
          showAddForm={showAddForm}
          addManualProduct={addManualProduct}
          setShowAddForm={setShowAddForm}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
        <AnimatePresence mode="popLayout">
          {visible.length === 0 ? (
            <motion.div
              key="empty"
              className="text-center col-span-full text-black-600 text-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              No products available.
            </motion.div>
          ) : (
            visible.map((p) => {
              const inCart = cartItems.some((ci) => ci.id === p.id);
              const checked = selectedProducts[p.id];

              return (
                <motion.div
                  key={p.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card
                    title={
                      <div className="block max-h-20 ">
                        <input
                          type="checkbox"
                          checked={checked || false}
                          onChange={() => toggleSelect(p.id)}
                          className="mr-2 h-4 w-4"
                        />
                        <span className="clamp-4-lines w-full">
                          {p.title || p.Productname}
                        </span>
                      </div>
                    }
                    Price={
                      <span className="w-24 shrink-0 font-semibold">{`₹${p.price}`}</span>
                    }
                    rating={
                      typeof p.rating === 'object' ? p.rating.rate : p.rating
                    }
                    Desc={
                      <div className="text-xs text-gray-600 mb-2 max-h-25 overflow-y-scroll">
                        {p.description}
                      </div>
                    }
                    image={p.image}
                    category={p.category}
                  >
                    <div className="space-y-2">
                      <CommonButton
                        label={inCart ? 'Go To Cart' : 'Add To Cart'}
                        onClick={() => {
                          if (inCart) {
                            navigate('/cart');
                          } else {
                            addToCart(p);
                            toast.success('Product Added to Cart');
                          }
                        }}
                        className={`w-full py-2 text-white rounded ${
                          inCart ? 'bg-green-700' : 'bg-indigo-600'
                        }`}
                      />

                      {user.Type === 'Admin' && (
                        <CommonButton
                          label="Delete"
                          onClick={() => deleteProducts(p.id)}
                          className="w-full py-2 text-white rounded bg-red-600 hover:bg-red-700"
                        />
                      )}
                    </div>
                  </Card>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>

      <Pagination
        postsPerPage={postsPerPage}
        totalPosts={filteredProducts.length}
        paginate={setCurrentPage}
        currentPage={currentPage}
        setpostPerPage={setPostsPerPage}
      />
    </>
  );
}

export default ProductList;
