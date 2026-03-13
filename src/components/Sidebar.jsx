import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import SidebarLinks from './SidebarLinks.json';

function Sidebar() {
  const { user } = useAuth();
  const role = user ? (user.Type === 'Admin' ? 'admin' : 'user') : 'guest';

  return (
    <div className="w-56 min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-slate-100 p-4 shadow-2xl border-r border-white/10">
      <ul className="space-y-2">
        {SidebarLinks.filter((link) => link.roles.includes(role)).map(
          ({ label, path, icon }) => (
            <li key={path}>
              <Link
                to={path}
                className="group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 hover:bg-white/10 hover:shadow-md hover:scale-[1.02]"
              >
                <span className="text-lg text-cyan-400 group-hover:text-cyan-300 transition-colors">
                  {icon}
                </span>
                <span>{label}</span>
              </Link>
            </li>
          )
        )}
      </ul>
    </div>
  );
}

export default Sidebar;
