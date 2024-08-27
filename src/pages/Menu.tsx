import Button from "@/components/common/button";
import React from "react";

function Menu() {
  return (
    <div className="grid grid-cols-4 gap-4">
      <Button label="Burger" />
      <Button label="Pizza" />
      <Button label="Role Pratha" />
      <Button label="Chicken" />
    </div>
  );
}

export default Menu;
