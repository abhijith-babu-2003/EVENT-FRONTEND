import React from "react";
import { ToastContainer } from "react-toastify";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Events from "./pages/Events";
import Contact from "./pages/Contact";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute"; // import it
import About from "./pages/About";
import CheckOut from "./pages/CheckOut";
import Payment from "./pages/Payment";
import UserProfilePage from "./pages/UserProfilePage";
import Bookings from "./pages/Bookings";
const App = () => {
  return (
    <div>
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element ={<About/>}/>

        <Route element={<ProtectedRoute />}>
          <Route path="/events" element={<Events />} />
          <Route path="/checkout/:eventId" element={<CheckOut />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/profile" element={<UserProfilePage />} />
          <Route path="/bookings" element={<Bookings />} />
        </Route>

      </Routes>

      <Footer />

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default App;

