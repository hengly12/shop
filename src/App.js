import React from 'react';
import Home from './pages/Home';
import { BrowserRouter, Routes, Route } from 'react-router-dom'; // Correct import for routing
import './App.css';
import { PayPalScriptProvider } from "@paypal/react-paypal-js"; 
import AOS from "aos";
import "aos/dist/aos.css";

AOS.init();
function App() {
  return (
    <PayPalScriptProvider options={{ "client-id": "ASLY6CzEzwvTXOJs6_ozYGHnz5RxL83gOiQiollolBnWLR_ET00cb2aquzIVzqiiXqigiiq7SQ8eMhV_" }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </PayPalScriptProvider>
  );
}

export default App;