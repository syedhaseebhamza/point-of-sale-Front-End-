import React from "react";
import defaultimage from "/defaultimge.png";

interface CardProps {
  image?: string;
  name?: string;
  description?: string;
}

function Card({ image, name, description }: CardProps) {
  console.log("image", image);

  return (
    <div className="max-w-48 min-w-48 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
      <img
        className="rounded-t-lg min-w-12 max-w-12 min-h-12 max-h-12 object-cover"
        src={image === null ? defaultimage : image}
        alt={defaultimage}
      />

      <div className="p-5">
        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          {name}
        </h5>

        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
          {description}
        </p>
      </div>
    </div>
  );
}

export default Card;
