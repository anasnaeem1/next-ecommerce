import { useContext } from "react";
import { AddReview } from "../serverActions/review";
import SelectReviewStars from "./SelectReviewStars";
import { UserContext } from "../../context/UserContext";

export default function AddReviewForm({
  productId,
  productSlug,
}: {
  productId: string;
  productSlug: string;
}) {
  const { dispatch } = useContext(UserContext);

  async function handleSubmit(
    formData: FormData,
    formElement?: HTMLFormElement
  ) {
    const result = await AddReview(formData);

    if (result.success) {
      const ratingStars = Number(formData.get("rating") || 0);

      // Reset the form input if the form element is provided
      if (formElement) formElement.reset();

      dispatch({
        type: "SET_NOTIFICATION",
        payload: {
          type: "Success",
          label: `Review Submitted (${ratingStars}★)`,
        },
      });
    } else {
      dispatch({
        type: "SET_NOTIFICATION",
        payload: { type: "Error", label: "Something went wrong" },
      });
    }
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        handleSubmit(fd, e.currentTarget);
      }}
      className="p-10 rounded-2xl shadow-sm space-y-8 bg-white"
    >
      <input type="hidden" name="productId" value={productId} />
      <input type="hidden" name="productSlug" value={productSlug} />
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold text-gray-800">
          Share Your Review
        </h2>
        <p className="text-gray-500 text-sm">
          We’d love to hear your feedback!
        </p>
      </div>

      {/* Stars */}
      <SelectReviewStars />

      {/* Name + Email */}
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            type="text"
            name="name"
            placeholder="Enter your name"
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl 
                       focus:outline-none focus:ring-2 focus:ring-blue-500 
                       focus:border-blue-500 hover:border-gray-300 
                       transition shadow-sm"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl 
                       focus:outline-none focus:ring-2 focus:ring-blue-500 
                       focus:border-blue-500 hover:border-gray-300 
                       transition shadow-sm"
            required
          />
        </div>
      </div>

      {/* Review */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Review
        </label>
        <textarea
          name="review"
          placeholder="Write your review..."
          className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 
                     focus:border-blue-500 hover:border-gray-300 
                     transition shadow-sm"
          rows={4}
          required
        />
      </div>

      <div className="flex justify-center">
        <button
          type="submit"
          className="write-button border bg-teal-500 hover:bg-teal-600 transition-colors rounded-3xl flex items-center gap-2 px-6 py-2 text-white"
        >
          <span>Submit</span>
        </button>
      </div>
    </form>
  );
}
