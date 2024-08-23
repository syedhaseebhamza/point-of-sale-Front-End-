import Button from "@/components/common/button";
import React from "react";

function RolePermission() {
  return (
    <div className="p-8">
      <div className="flex justify-end items-center gap-3">
        <h1 className="text-2xl font-bold mb-[0.5rem]">User Permission</h1>
        <Button label="Add Permission" />
      </div>
    </div>
  );
}

export default RolePermission;
