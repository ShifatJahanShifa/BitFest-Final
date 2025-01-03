import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const FoodDetail = () => {
  const { id } = useParams(); // Get food ID from the URL
  const [foodItem, setFoodItem] = useState(null);
  const [addOns, setAddOns] = useState([]);
  const [flavor, setFlavor] = useState("vanilla");
  const [weight, setWeight] = useState(1.5); // Default weight
  const [review, setReview] = useState("");
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [price, setPrice] = useState(0);

  // Fetch food details
  useEffect(() => {
    const fetchFoodItem = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:8080/api/foods/${id}`);
        setFoodItem(response.data);
        setPrice(response.data.basePrice); // Initialize with best price
        console.log(price);
      } catch (err) {
        setError("Failed to load food details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchFoodItem();
  }, [id]);

  // Update price whenever flavor or weight changes
  useEffect(() => {
    if (foodItem) {
      const flavorPrice =
        foodItem.flavor?.find((f) => f.flavorName === flavor)?.price || 0;
      const weightOption =
        foodItem.weight?.find((w) => w.weight === weight) || {};
      const weightPrice = weightOption.price || 0;

      setPrice(foodItem.basePrice + flavorPrice + weightPrice);
    }
  }, [flavor, weight, foodItem]);

  // Toggle Add-Ons
  const toggleAddOn = (option) => {
    setAddOns((prevAddOns) =>
      prevAddOns.includes(option)
        ? prevAddOns.filter((addOn) => addOn !== option)
        : [...prevAddOns, option]
    );
  };

  // Handle Add to Cart
  const handleAddToCart = () => {
    alert(
      `Added to cart: ${flavor} cake, ${weight} pounds, with ${addOns.join(
        ", "
      )}. Total Price: ${price} TK`
    );
  };

  // Add a review
  const handleAddReview = () => {
    if (review.trim()) {
      setReviews([...reviews, review]);
      setReview("");
    }
  };

  return (
    <div className="md:flex items-start justify-center py-12 2xl:px-20 md:px-6 px-9">
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : foodItem ? (
        <>
          {/* Product Image */}
          <div>
            <img
              src={`http://localhost:8080/api/foods/image/${foodItem.images?.[0]}`}
              alt={foodItem.name}
              className="w-[35rem] h-[20rem] mt-[2rem] mr-[2rem] rounded-md shadow-lg"
              onError={(e) => {
                e.target.src = "placeholder-image.jpg"; // Fallback image
              }}
            />
            {/* Review Section */}
            <div className="mt-8">
              <p className="text-base font-semibold text-gray-800">Reviews:</p>
              <textarea
                className="w-[35rem] p-2 border border-gray-300 rounded mt-2"
                placeholder="Write your review here..."
                value={review}
                onChange={(e) => setReview(e.target.value)}
              />
              <button
                className="text-base w-[35rem] flex items-center justify-center leading-none text-white bg-gray-800 py-2 hover:bg-gray-700 focus:outline-none mt-2"
                onClick={handleAddReview}
              >
                Submit Review
              </button>
              <div className="mt-4">
                {reviews.map((r, index) => (
                  <p
                    key={index}
                    className="text-sm text-gray-600 border-b border-gray-200 py-2"
                  >
                    {r}
                  </p>
                ))}
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="xl:w-2/5 md:w-1/2 lg:ml-8 md:ml-6 md:mt-0 mt-6">
            <div className="border-b border-gray-200 pb-6">
              <h1 className="lg:text-2xl text-xl font-semibold lg:leading-6 leading-7 mt-[2rem] text-gray-800">
                {foodItem.name}
              </h1>
              <p className="mt-2 text-gray-600">{foodItem.description}</p>
              <p className="mt-2 text-gray-600">
                Sub-Category: {foodItem.subCategory}
              </p>
            </div>

            {/* Flavor Selection */}
            <div className="mt-4">
              <p className="text-base font-semibold text-gray-800">Flavor:</p>
              <select
                className="w-full p-2 border border-gray-300 rounded mt-2"
                value={flavor}
                onChange={(e) => setFlavor(e.target.value)}
              >
                {foodItem.flavor?.map((f, index) => (
                  <option key={index} value={f.flavorName || ""}>
                    {f.flavorName || "Unnamed Flavor"} -{" "}
                    {f.price ? `${f.price} TK` : "Price not available"}
                  </option>
                ))}
              </select>
            </div>

            {/* Weight Selection */}
            <div className="mt-4">
              <p className="text-base font-semibold text-gray-800">
                Weight (in pounds):
              </p>
              <select
                className="w-full p-2 border border-gray-300 rounded mt-2"
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
              >
                {foodItem.weight?.map((w, index) => (
                  <option key={index} value={w.weight}>
                    {w.weight} pounds - {w.price} TK additional
                  </option>
                ))}
              </select>
            </div>

            {/* Add-Ons */}
            <div className="mt-4">
              <p className="text-base font-semibold text-gray-800">Add-Ons:</p>
              <div className="flex gap-4 mt-2">
                <label>
                  <input
                    type="checkbox"
                    className="mr-2"
                    onChange={() => toggleAddOn("Extra Chocolate")}
                  />
                  Extra Chocolate
                </label>
                <label>
                  <input
                    type="checkbox"
                    className="mr-2"
                    onChange={() => toggleAddOn("Extra Sprinkles")}
                  />
                  Extra Sprinkles
                </label>
              </div>
            </div>

            {/* Price Section */}
            <div className="mt-4">
              <p className="text-base font-semibold text-gray-800">
                Total Price: {price} TK
              </p>
            </div>

            {/* Add to Cart Button */}
            <button
              className="text-base flex items-center justify-center leading-none text-white bg-gray-800 w-full py-4 hover:bg-gray-700 focus:outline-none mt-4"
              onClick={handleAddToCart}
            >
              Add to Cart
            </button>
          </div>
        </>
      ) : (
        <p>No food item found.</p>
      )}
    </div>
  );
};

export default FoodDetail;
