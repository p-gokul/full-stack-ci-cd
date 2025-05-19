import React from "react";
import { ModeToggle } from "./ModeToggle";

const Navbar: React.FC = () => {
  return (
    <div className="w-screen h-auto bg-red-30 flex flex-row justify-around items-center py-2">
      <h3>Todo App = V3 =</h3>
      <div>
        <ModeToggle />
      </div>
    </div>
  );
};

export default Navbar;
