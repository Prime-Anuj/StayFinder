import React, { useState } from 'react';

const ImageGallery = ({ images }) => {
    const [selectedImage, setSelectedImage] = useState(0);
    const [showModal, setShowModal] = useState(false);

    if (!images || images.length === 0) {
        return (
            <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-gray-500">No images available</span>
            </div>
        );
    }

    return (
        <>
            <div className="grid grid-cols-4 gap-2 h-96">
                {/* Main Image */}
                <div className="col-span-2 row-span-2">
                    <img
                        src={images[0]}
                        alt="Main property"
                        className="w-full h-full object-cover rounded-l-lg cursor-pointer hover:opacity-90"
                        onClick={() => {
                            setSelectedImage(0);
                            setShowModal(true);
                        }}
                    />
                </div>

                {/* Side Images */}
                {images.slice(1, 5).map((image, index) => (
                    <div key={index + 1} className="relative">
                        <img
                            src={image}
                            alt={`Property ${index + 2}`}
                            className={`w-full h-full object-cover cursor-pointer hover:opacity-90 ${
                                index === 1 ? 'rounded-tr-lg' : 
                                index === 3 ? 'rounded-br-lg' : ''
                            }`}
                            onClick={() => {
                                setSelectedImage(index + 1);
                                setShowModal(true);
                            }}
                        />
                        {index === 3 && images.length > 5 && (
                            <div 
                                className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-br-lg cursor-pointer"
                                onClick={() => setShowModal(true)}
                            >
                                <span className="text-white font-semibold">
                                    +{images.length - 5} more
                                </span>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                    <div className="max-w-4xl max-h-full relative">
                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full w-10 h-10 flex items-center justify-center hover:bg-opacity-75 z-10"
                        >
                            ×
                        </button>
                        
                        <img
                            src={images[selectedImage]}
                            alt={`Property ${selectedImage + 1}`}
                            className="max-w-full max-h-full object-contain"
                        />

                        {/* Navigation */}
                        {images.length > 1 && (
                            <>
                                <button
                                    onClick={() => setSelectedImage(selectedImage > 0 ? selectedImage - 1 : images.length - 1)}
                                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white bg-black bg-opacity-50 rounded-full w-10 h-10 flex items-center justify-center hover:bg-opacity-75"
                                >
                                    ‹
                                </button>
                                <button
                                    onClick={() => setSelectedImage(selectedImage < images.length - 1 ? selectedImage + 1 : 0)}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white bg-black bg-opacity-50 rounded-full w-10 h-10 flex items-center justify-center hover:bg-opacity-75"
                                >
                                    ›
                                </button>
                            </>
                        )}

                        {/* Image Counter */}
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white bg-black bg-opacity-50 px-3 py-1 rounded">
                            {selectedImage + 1} / {images.length}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ImageGallery;
