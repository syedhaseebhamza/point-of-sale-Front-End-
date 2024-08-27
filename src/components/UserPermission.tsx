import React, { useState } from "react";
import ToggleSwitch from "./common/checkbox";
import Button from "./common/button";
import { useAppSelector } from "@/app/hooks";

type PermissionActions = "view" | "create" | "edit" | "delete";
type PermissionModule = "userManagement" | "rolePermission";

interface Permissions {
  userManagement: Record<PermissionActions, boolean>;
  rolePermission: Record<PermissionActions, boolean>;
}

const ACTIONS: PermissionActions[] = ["view", "create", "edit", "delete"];
const MODULES: PermissionModule[] = ["userManagement", "rolePermission"];

function UserPermission() {
  const user = useAppSelector((state) => state.auth.user);
  const [allPermission, setAllPermission] = useState<boolean>(false);
  const [permissions, setPermissions] = useState<Permissions>({
    userManagement: { view: false, create: false, edit: false, delete: false },
    rolePermission: { view: false, create: false, edit: false, delete: false },
  });

  const handleSelectAll = () => {
    const newValue = !allPermission;
    setAllPermission(newValue);
    setPermissions(
      MODULES.reduce<Permissions>((acc, module) => {
        acc[module] = ACTIONS.reduce<Record<PermissionActions, boolean>>(
          (modAcc, action) => {
            modAcc[action] = newValue;
            return modAcc;
          },
          {} as Record<PermissionActions, boolean>
        );
        return acc;
      }, {} as Permissions)
    );
  };

  const handleToggle = (
    module: PermissionModule,
    action: PermissionActions
  ) => {
    setPermissions((prev) => ({
      ...prev,
      [module]: {
        ...prev[module],
        [action]: !prev[module][action],
      },
    }));
  };

  const handleToggleAll = (action: PermissionActions) => {
    setPermissions((prev) => ({
      ...prev,
      userManagement: {
        ...prev.userManagement,
        [action]: !prev.userManagement[action],
      },
      rolePermission: {
        ...prev.rolePermission,
        [action]: !prev.rolePermission[action],
      },
    }));
  };

  const handleSave = () => {
    const actionIdMap: Record<PermissionActions, number> = {
      view: 1,
      create: 2,
      edit: 3,
      delete: 4,
    };

    const savedPermissions = MODULES.map((module) => {
      const actionIds = ACTIONS.filter(
        (action) => permissions[module][action]
      ).map((action) => actionIdMap[action]);

      return {
        moduleName:
          module.charAt(0).toUpperCase() +
          module.slice(1).replace(/([A-Z])/g, " $1"),
        actionIds,
      };
    });
  };

  const renderToggles = (module: PermissionModule) =>
    ACTIONS.map((action) => (
      <td key={action} className="px-6 py-4">
        <ToggleSwitch
          isOn={permissions[module][action]}
          handleToggle={() => handleToggle(module, action)}
        />
      </td>
    ));

  return (
    <div className="max-h-[400px] h-[400px] lg:w-[400px] lg:max-w-[400px] 2xl:w-[800px] 2xl:max-w-[800px] bg-white px-16 pt-20 pb-[25rem]">
      <div className="flex items-center gap-3">
        <span>Permission :</span>
        <ToggleSwitch
          isOn={allPermission}
          handleToggle={handleSelectAll}
          label="Select All"
        />
      </div>
      <div className="flex items-center justify-between pt-[2rem] pb-[1rem] border-b-[#30412e] border-b-2">
        {ACTIONS.map((action) => (
          <ToggleSwitch
            key={action}
            isOn={permissions.userManagement[action]}
            handleToggle={() => handleToggleAll(action)}
            label={`${action.charAt(0).toUpperCase() + action.slice(1)} All`}
          />
        ))}
      </div>

      <div className="relative overflow-x-auto w-full pt-[2rem]">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Module Name
              </th>
              {ACTIONS.map((action) => (
                <th key={action} scope="col" className="px-6 py-3">
                  {action.charAt(0).toUpperCase() + action.slice(1)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {MODULES.map((module) => (
              <tr
                key={module}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
              >
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  {module.charAt(0).toUpperCase() +
                    module.slice(1).replace(/([A-Z])/g, " $1")}
                </th>
                {renderToggles(module)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-end items-end pt-[1rem]">
        <Button label="Save" onClick={handleSave} />
      </div>
    </div>
  );
}

export default UserPermission;
