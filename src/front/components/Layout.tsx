import Sidebar from "./Sidebar";

type LayoutProps = {
    children: React.ReactNode
}

const Layout = (props : LayoutProps) => {
  return ( 
    <div className="flex">
      <nav className="h-screen w-48 shadow hover:shadow-lg bg-gray-0">
        <Sidebar />
      </nav>
      <div className="w-[calc(100%_-_w-48)] h-screen overflow-y-auto">
        {props.children}
      </div>
      
    </div>
  );
};

export default Layout;
