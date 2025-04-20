import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import Home from "./components/home/Home";
import Login from "./pages/login/Login";


import AboutUs from "./components/aboutUs/AboutUs";
import Forum from "./components/forum/Forum";
import ContactUs from "./components/contactUs/ContactUs";



function App() {
  return (
    <BrowserRouter>
      <Routes>
      <Route path="/" element={<Home/>}/>       
      <Route path="/login" element={<Login/>}/>
      <Route path="/about" element={<AboutUs />} />
      <Route path="/forum" element={<Forum />} />
      <Route path="/contact" element={<ContactUs />} />
     

      </Routes>
    </BrowserRouter>
  );
}

export default App;