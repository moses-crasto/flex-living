'use client';

import { useEffect, useState } from "react";

interface Property {
  id: string;
  name: string;
  image: string;
  guests: number;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
}

interface Review {
  id: string;
  listingName: string;
  guestName: string;
  rating: number;
  publicReview: string;
  submittedAt: string;
  status: string;             // ✅ added
  propertyId: string;
  approved: boolean;         // ✅ added
}

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const propRes = await fetch('/api/properties');
      const propsData = await propRes.json();

      const revRes = await fetch('/api/reviews/hostaway');
      const revsData = await revRes.json();

      setProperties(propsData.properties);

      // ✅ fix: filter reviews by `status === 'published'` instead of `approved`
      setReviews(revsData.reviews.filter((r: Review) => r.approved));

      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return <main className="p-8">Loading properties...</main>;
  }

  return (
    <main className="p-6 space-y-8 max-w-6xl mx-auto funnel-display">
      <h1 className="font-weight-800 text-5xl font-bold mb-6">Our Properties</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {properties.map((property) => (
          <div
            key={property.id}
            className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col"
          >
            {/* Image */}
            <img
              src={property.image}
              alt={property.name}
              className="w-full h-64 object-cover rounded-t-2xl"
            />

            {/* Info */}
            <div className="p-4 flex-1 flex flex-col">
              <h2 className="text-xl font-semibold">{property.name}</h2>

              <div className="text-gray-600 mt-1 text-sm">
                {property.guests} Guests · {property.bedrooms} Bedrooms · {property.bathrooms} Bathrooms
              </div>

              <div className="mt-2">
                <h3 className="font-semibold text-sm">Amenities</h3>
                <ul className="flex flex-wrap gap-2 mt-1">
                  {property.amenities.map((a) => (
                    <li
                      key={a}
                      className="bg-gray-100 px-2 py-1 rounded text-xs"
                    >
                      {a}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Reviews */}
            <div className="bg-gray-50 p-4">
              <h3 className="text-lg font-semibold">Guest Reviews</h3>

              {reviews.filter(r => r.propertyId === property.id).length === 0 ? (
                <p className="text-sm text-gray-500 mt-2">
                  No published reviews yet.
                </p>
              ) : (
                <div className="space-y-2 mt-2">
                  {reviews
                    .filter(r => r.propertyId === property.id)
                    .map((r) => (
                      <div key={r.id} className="border-b py-2">
                        <div className="flex justify-between">
                          <span className="font-medium">{r.guestName}</span>
                          <span className="text-yellow-500">⭐ {r.rating}</span>
                        </div>
                        <p className="text-sm mt-1">{r.publicReview}</p>
                        <p className="text-xs text-gray-400">
                          {new Date(r.submittedAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

    </main>
  );
}
