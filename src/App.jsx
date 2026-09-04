import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import WhatsAppButton from './components/WhatsAppButton';
import Footer from './components/Footer';

import Hero from './sections/Hero';
import About from './sections/About';
import Facilities from './sections/Facilities';
import Booking from './sections/Booking';
import Pricing from './sections/Pricing';
import Gallery from './sections/Gallery';
import WhyChooseUs from './sections/WhyChooseUs';
import Tournament from './sections/Tournament';
import Testimonials from './sections/Testimonials';
import Contact from './sections/Contact';

import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './pages/ProtectedRoute';
import NotFound from './pages/NotFound';


/* =========================================================
   PUBLIC WEBSITE
   ========================================================= */

function PublicWebsite() {
  return (
    <>
      <Navbar />

      <main>
        <Hero />
        <About />
        <Facilities />
        <Booking />
        <Pricing />
        <Gallery />
        <WhyChooseUs />
        <Tournament />
        <Testimonials />
        <Contact />
      </main>

      <Footer />

      <WhatsAppButton />
    </>
  );
}


/* =========================================================
   APP
   ========================================================= */

function App() {

  /* =======================================================
     GLOBAL HORIZONTAL SCROLL LOCK

     This prevents accidental sideways dragging on
     mobile/tablet without adding CSS to every section.
     ======================================================= */

  useEffect(() => {

    const preventHorizontalScroll = () => {
      if (window.scrollX !== 0) {
        window.scrollTo({
          left: 0,
          top: window.scrollY,
          behavior: 'auto',
        });
      }
    };

    // Reset horizontal position when app starts
    window.scrollTo({
      left: 0,
      top: window.scrollY,
      behavior: 'auto',
    });

    window.addEventListener(
      'scroll',
      preventHorizontalScroll,
      { passive: true }
    );

    return () => {
      window.removeEventListener(
        'scroll',
        preventHorizontalScroll
      );
    };

  }, []);


  /* =======================================================
     PAGE SCROLL RESET

     Every time the browser loads the application,
     start from the top-left position.
     ======================================================= */

  useEffect(() => {

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'auto',
    });

  }, []);


  /* =======================================================
     ROUTES
     ======================================================= */

  return (
    <BrowserRouter>

      <Routes>

        {/* =================================================
            PUBLIC WEBSITE
            ================================================= */}

        <Route
          path="/"
          element={<PublicWebsite />}
        />


        {/* =================================================
            ADMIN LOGIN
            ================================================= */}

        <Route
          path="/admin/login"
          element={<AdminLogin />}
        />


        {/* =================================================
            PROTECTED ADMIN DASHBOARD

            Dashboard cannot be opened without login.
            ================================================= */}

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />


        {/* =================================================
            404 PAGE
            ================================================= */}

        <Route
          path="*"
          element={<NotFound />}
        />

      </Routes>

    </BrowserRouter>
  );
}


export default App;