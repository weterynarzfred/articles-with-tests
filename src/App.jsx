import { Route, Routes, useLocation } from "react-router-dom";

import Articles from "./pages/Articles";
import Nav from "./Components/Nav";
import Home from "./pages/Home";
import { useEffect } from "react";

function App() {
  const location = useLocation();
  useEffect(() => {
    document.body.focus();
  }, [location.pathname]);

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
    <button className="skip-to-content" onClick={() => document.getElementById("main-content")?.focus()}>Skip to content</button>
    <Nav />
    <main id="main-content" tabIndex={-1}>
      <Routes>
        <Route path="/articles/*" element={<Articles />}></Route>
        <Route path="/" element={<Home></Home>}></Route>
      </Routes>
    </main>
  </div>;
}

export default App;
