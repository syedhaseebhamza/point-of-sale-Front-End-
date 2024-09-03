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
    <div className="cursor-pointer max-w-48 min-w-48  bg-white border border-gray-200 rounded-lg shadow-xl ">
      <div className="flex justify-center ">
        <img
          className=" w-full min-h-24  max-h-24 object-cover"
          src={image === null ? defaultimage : image}
          alt={defaultimage}
        />
      </div>
      <div className="py-2 px-4">
        <h5 className="text-xl font-bold tracking-tight">{name}</h5>

        <p className="font-normal truncate">{description}</p>
      </div>
    </div>
  );
}

export default Card;
