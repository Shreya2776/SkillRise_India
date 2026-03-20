// components/Layout.jsx

import Sidebar from "../components/layout/Sidebar";
import { useState } from "react";

export default function Layout({ children }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-[#0f0c29] text-white">

      {/* SIDEBAR */}
      <Sidebar
        isCollapsed={isCollapsed}
        toggleSidebar={() => setIsCollapsed(!isCollapsed)}
      />

      {/* MAIN CONTENT */}
      <div className="flex-1 overflow-y-auto p-6">
        {children}
      </div>

    </div>
  );
}