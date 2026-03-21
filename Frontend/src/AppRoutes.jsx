import {BrowserRouter, Route, Routes} from "react-router";
import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";

function AppRoutes(){
  return (
    <BrowserRouter>
      <Routes>
         <Route path="/" element={<h1>hello kaise ho...</h1>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;