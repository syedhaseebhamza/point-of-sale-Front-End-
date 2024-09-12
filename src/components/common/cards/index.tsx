import React from "react";
import defaultimage from "/defaultimge.png";

interface CardProps {
  image?: string;
  name?: string;
}

function Card({ image, name }: CardProps) {

  return (
    <div className="cursor-pointer py-2 px-2 bg-white border border-gray-600 rounded-[48px]   shadow-md shadow-gray-600 hover:scale-[1.09]">
      <div className="flex items-center justify-between">
        <img
          className="max-h-12 max-w-12 min-w-12 min-h-12 rounded-full object-cover"
          src={image === null ? defaultimage : image}
          alt={defaultimage}
        />

        <h5 className="text-xl font-bold tracking-tight truncate">{name}</h5>
      </div>
    </div>
  );
}

export default Card;
