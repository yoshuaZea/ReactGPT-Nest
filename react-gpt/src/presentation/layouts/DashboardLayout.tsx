import { Outlet } from 'react-router-dom'
import { SidebarMenuItem } from '../components/sidebar/SidebarMenuItem'
import { menuRoutes } from '../router/routes'

export const DashboardLayout = () => {
  return (
    <main className="flex flex-row gap-5 p-5">
      <nav className="hidden sm:flex flex-col w-[370px] min-h-[calc(100vh-3.0rem)] bg-zinc-400 bg-opacity-10 p-5 rounded-3xl">
        <h1 className="font-bold text-lg lg:text-3xl text-zinc-700 bg-clip-text text-transparent">
          ReactGPT
        </h1>
        <span className="text-xl">Bienvenido</span>

        <div className="border-gray-700 border my-3" />
          {
            menuRoutes.map(option => (
              <SidebarMenuItem key={option.to} {...option} />
            ))
          }
      </nav>

      <section className="flex flex-col w-full h-[calc(100vh-50px)]  bg-zinc-400 bg-opacity-10 p-5 rounded-3xl">
        <div className="flex flex-row h-full">
          <div className="flex flex-col flex-auto h-full p-1">
            <Outlet />
          </div>
        </div>
      </section>
    </main>
  )
}
