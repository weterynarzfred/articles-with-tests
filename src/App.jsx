import { Route, Routes } from "react-router-dom";

import Articles from "./pages/Articles";
import Nav from "./Components/Nav";
import Home from "./pages/Home";
import { useEffect } from "react";

function App() {

  useEffect(() => {
    const update = () => {
      const width = window.innerWidth - document.documentElement.clientWidth;
      document.documentElement.style.setProperty("--scrollbar-width", `${width}px`);
    };
    update();
    window.addEventListener("resize", update);
    const ro = new ResizeObserver(update);
    ro.observe(document.body);
    return () => {
      window.removeEventListener("resize", update);
      ro.disconnect();
    };
  }, []);

  return <div>
    <Nav></Nav>
    <Routes>
      <Route path="/articles/*" element={<Articles />}></Route>
      <Route path="/" element={<Home></Home>}></Route>
    </Routes>
  </div >;
}

export default App;
