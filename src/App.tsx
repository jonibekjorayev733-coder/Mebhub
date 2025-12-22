import { Routes, Route } from "react-router-dom";

import Fresh from "./Component/fresh/Fresh";
import Header from "./Component/header/Header";
import Main from "./Component/main/Main";
import Mobilestore from "./Component/mobilestore/Mobilestore";
import Section from "./Component/section/Section";
import Sectionone from "./Component/sectionone/Sectionone";
import Sectiontwo from "./Component/sectiontwo/Sectiontwo";
import Footer from "./Component/footer/Footer";
import Bestselling from "./bestSelling/Bestselling";
import Login from "./Component/Admindonlod/Login";
import './index.css';
import Cart from "./Component/Componentproduct/Pages/Cart"
import AdminPanel from "./Component/Admindonlod/AdminPanel/adminpanelone/AdminPanel"
import Cheforder from "./Component/Admindonlod/Chefpanel/adminpanelone/AdminPanel"


export default function App() {

  return (
    <Routes>
      <Route
        path="/"
        element={
          <>
            <Header />
            <Main />
            <Section />
            <Fresh />
            <Sectionone />
            <Sectiontwo />
            <Bestselling />
            <Mobilestore />
            <Footer />
          </>
        }
      />

<Route path="/login" element={<Login />} />
<Route path="/chef" element={<Cheforder/>}/>
<Route path="/admin" element={<AdminPanel/>} />

<Route path="/cart" element={<Cart />} />
    </Routes>
  );
}
