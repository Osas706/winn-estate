import React from "react";
import { Link } from 'react-router-dom';
import "../index.css";
import { MapPin } from "lucide-react";

const ListingCard = ({ listing }) => {
  return (
    <div className="effect bg-white shadow-md border border-slate-300 hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full ">
      <Link to={`/listing/${listing._id}`}>

        <img
          src={
            listing.imageUrls[0] ||
            "https://cdn.punchng.com/wp-content/uploads/2022/02/27232405/housing-estate-Octo5-Holdings.jpg"
          }
          alt="listing cover"
          className="h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 transition-scale duration-300"
        />

        <div className="p-3 flex flex-col gap-2 w-full">
          <p className="truncate text-lg font-semibold text-slate-700">
            {listing.name}
          </p>

          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4 text-red-700 fill-red-200" />
            <p className="text-sm text-gray-600 truncate w-full">
              {listing.address}
            </p>
          </div>

          <p className="text-sm text-gray-600 line-clamp-2">
            {listing.description}
          </p>

          <p className="text-slate-500 mt-2 font-semibold ">
            ₦
            {listing.offer
              ? listing.discountedPrice.toLocaleString("en-US")
              : listing.regularPrice.toLocaleString("en-US")}
            {listing.type === "rent" && " / month"}
          </p>

          <div className="text-slate-700 flex gap-4">
            <div className="font-bold text-xs">

              {listing.bedrooms > 1
                ? `${listing.bedrooms} beds `
                : `${listing.bedrooms} bed `}
            </div>

            <div className="font-bold text-xs">
              {listing.bathrooms > 1
                ? `${listing.bathrooms} baths `
                : `${listing.bathrooms} bath `}
            </div>
          </div>

        </div>

      </Link>
    </div>
  );
};

export default ListingCard;
