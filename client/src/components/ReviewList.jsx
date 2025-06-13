import React from 'react';

const ReviewList = ({ reviews = [], rating = 0 }) => {
    if (!reviews || reviews.length === 0) {
        return (
            <div className="border-b pb-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Reviews</h3>
                <p className="text-gray-500">No reviews yet. Be the first to leave a review!</p>
            </div>
        );
    }

    return (
        <div className="border-b pb-6 mb-6">
            <div className="flex items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mr-4">
                    {reviews.length} Review{reviews.length !== 1 ? 's' : ''}
                </h3>
                <div className="flex items-center">
                    <svg className="w-5 h-5 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-lg font-semibold">{rating}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {reviews.map((review, index) => (
                    <div key={index} className="border-b border-gray-100 pb-4 last:border-b-0">
                        <div className="flex items-center mb-2">
                            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                                <span className="text-sm font-semibold">
                                    {review.user?.name?.charAt(0) || 'U'}
                                </span>
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">{review.user?.name || 'Anonymous'}</p>
                                <div className="flex items-center">
                                    {[...Array(5)].map((_, i) => (
                                        <svg
                                            key={i}
                                            className={`w-4 h-4 ${
                                                i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                                            }`}
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    ))}
                                    <span className="ml-2 text-sm text-gray-500">
                                        {new Date(review.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ReviewList;
