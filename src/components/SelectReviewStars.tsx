"use client";
import { useState } from "react";

const SelectReviewStars = () => {
  const [reviewStars, setReviewStars] = useState(0);
  const [hover, setHover] = useState(0);

  return (
    <div className="text-center">
      <label className="block text-sm font-medium text-gray-700 mb-3">
        Rating
      </label>
      <div className="flex justify-center space-x-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            onClick={() => setReviewStars(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            className={`cursor-pointer text-4xl transition ${
              (hover || reviewStars) >= star
                ? "text-yellow-400"
                : "text-gray-300"
            }`}
          >
            ★
          </span>
        ))}
      </div>

      {/* 🔑 Hidden input to submit value with the form */}
      <input type="hidden" name="rating" value={reviewStars} />

      {reviewStars > 0 && (
        <p className="mt-2 text-sm text-gray-600">
          You selected {reviewStars} star{reviewStars > 1 && "s"}
        </p>
      )}
    </div>
  );
};

export default SelectReviewStars;
