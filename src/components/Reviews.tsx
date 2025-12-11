"use client";
import { useContext, useEffect, useState } from "react";
import "./reviews.css";
import AddReviewForm from "./AddReviewForm";
import { UserContext } from "../../context/UserContext";

type ReviewsProps = {
  productId: string;
  productSlug: string;
};

const Reviews = ({ productId, productSlug }: ReviewsProps) => {
  const { notification, dispatch } = useContext(UserContext);
  const [addReviewForm, setAddReviewForm] = useState(false);

  const handleReviewForm = () => {
    setAddReviewForm(!addReviewForm);
  };

  return (
    <div className={`w-full flex bg-blue-50 rounded-xl p-6`}>
      {addReviewForm ? (
        <AddReviewForm productId={productId} productSlug={productSlug} />
      ) : (
        <>
          {/* Left section */}
          <div className="p-6 w-[40%] flex flex-col items-start gap-6">
            <h2 className="text-2xl font-bold text-gray-800">Reviews</h2>

            {/* Stars summary */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <i className="text-yellow-400 fa-solid fa-star"></i>
                  <i className="text-yellow-400 fa-solid fa-star"></i>
                  <i className="text-yellow-400 fa-solid fa-star"></i>
                  <i className="text-yellow-400 fa-solid fa-star-half-stroke"></i>
                  <i className="text-yellow-400 fa-regular fa-star"></i>
                </div>
                <span className="text-sm font-medium text-gray-700">
                  4.7 out of 5
                </span>
              </div>
              <span className="text-xs text-gray-500">Based on 7 reviews</span>
            </div>

            {/* Ratings Breakdown */}
            <div className="w-full max-w-sm space-y-3">
              <h3 className="text-base font-semibold text-gray-700">
                Customer Ratings
              </h3>

              {[
                { stars: 5, count: 128 },
                { stars: 4, count: 64 },
                { stars: 3, count: 31 },
                { stars: 2, count: 12 },
              ].map((rating, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between text-sm text-gray-600"
                >
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }, (_, i) => (
                      <i
                        key={i}
                        className={`${
                          i < rating.stars
                            ? "fa-solid fa-star text-yellow-400"
                            : "fa-regular fa-star text-yellow-400"
                        }`}
                      ></i>
                    ))}
                  </div>
                  <span>{rating.count}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Right section */}
      <div className="p-6 w-[60%] flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">Most Recent</h3>
          <button
            onClick={handleReviewForm}
            className="write-button border bg-teal-500 hover:bg-teal-600 transition-colors rounded-3xl flex items-center gap-2"
          >
            <span>{addReviewForm ? "Cancel Review" : "Leave a Review"}</span>
          </button>
        </div>
        <hr className="border-gray-300" />

        <h1>{notification?.label}</h1>

        {/* Review card */}
        <div className="w-full rounded-lg bg-white/50 p-5">
          {/* Stars + Date */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex gap-1">
              <i className="fa-solid fa-star text-yellow-400"></i>
              <i className="fa-solid fa-star text-yellow-400"></i>
              <i className="fa-solid fa-star text-yellow-400"></i>
              <i className="fa-solid fa-star-half-stroke text-yellow-400"></i>
              <i className="fa-regular fa-star text-yellow-400"></i>
            </div>
            <span className="text-xs text-gray-500">07/08/2025</span>
          </div>

          {/* User Info */}
          <div className="flex items-center gap-2 mb-3">
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
              <i className="fa-solid fa-user text-gray-500"></i>
            </div>
            <span className="text-sm font-medium text-gray-700">
              Khansa Asif
            </span>
            <span className="text-xs bg-teal-500 text-white px-2 py-0.5 rounded-full">
              Verified
            </span>
          </div>

          {/* Review Title + Text */}
          <h4 className="font-semibold text-gray-800">Good quality</h4>
          <p className="text-sm text-gray-600 mt-1">
            They are as shown in the picture. Comfortable and good quality.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Reviews;
