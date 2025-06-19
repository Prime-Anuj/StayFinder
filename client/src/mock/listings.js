// src/mock/listings.js
const listings = [
  {
    _id: "1",
    title: "Cozy Apartment in City Center",
    images: ["/placeholder1.jpg"],
    address: { city: "New York", country: "USA" },
    pricePerNight: 120,
    rating: 4.8,
    accommodates: 2,
    bedrooms: 1,
    bathrooms: 1,
    propertyType: "apartment",
    description: "A lovely apartment in the heart of the city.",
    amenities: ["wifi", "kitchen"],
    host: { name: "Alice" }
  },
  {
    _id: "2",
    title: "Beach House Retreat",
    images: ["/placeholder2.jpg"],
    address: { city: "Miami", country: "USA" },
    pricePerNight: 200,
    rating: 4.9,
    accommodates: 6,
    bedrooms: 3,
    bathrooms: 2,
    propertyType: "house",
    description: "Enjoy the ocean breeze at this beautiful beach house.",
    amenities: ["pool", "wifi"],
    host: { name: "Bob" }
  }
];

export default listings;
