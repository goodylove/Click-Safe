import { Outlet } from "react-router-dom";
// import Footer from "./Footer";

export function RootLayout() {
  return (
    <div className="min-h-screen flex flex-col ">
      {/* <nav>Nav here</nav> */}
      <main className="">
        {/* flex-1 container mx-auto px-4 py-8 */}
        <Outlet />
      </main>
  {/* <Footer /> */}
    </div>
  );
}