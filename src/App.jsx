import { Route, Routes } from "react-router-dom";
import { enableDragDropTouch } from "@dragdroptouch/drag-drop-touch";

import Articles from "./pages/Articles";
import Nav from "./Components/Nav";
import Home from "./pages/Home";
import { useEffect } from "react";

function App() {

  useEffect(() => {
    enableDragDropTouch();
  }, []);

  return (
    <div>
      <Nav></Nav>
      <Routes>
        <Route path="/articles/*" element={<Articles />}></Route>
        <Route path="/" element={<Home></Home>}></Route>
      </Routes>
    </div >);

}

export default App;
