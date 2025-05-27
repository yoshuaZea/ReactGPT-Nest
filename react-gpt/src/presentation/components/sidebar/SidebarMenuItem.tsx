import { NavLink } from 'react-router-dom';

interface SidebarMenuItemProps {
  to: string;
  icon: string;
  title: string;
  description: string;
}

export const SidebarMenuItem = ({ to, icon, title, description  }: SidebarMenuItemProps) => {
  return (
    <NavLink
      to={to}
      className={
        ({ isActive }) => isActive
          ? 'flex justify-center items-center bg-zinc-700 text-white rounded-md p-2 transition-colors'
          : 'flex justify-center items-center text-zinc-700 hover:bg-zinc-700 hover:text-white rounded-md p-2 transition-colors' }
    >
      <i className={`${icon} text-2xl mr-4 text-zinc-400 self-start`}></i>
      <div className="flex flex-col flex-grow">
        <span className="text-lg font-semibold">{title}</span>
        <span className="text-zinc-400 text-sm">{description}</span>
      </div>
    </NavLink>
  )
}
