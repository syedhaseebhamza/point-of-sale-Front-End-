import Button from "@/components/common/button";

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
