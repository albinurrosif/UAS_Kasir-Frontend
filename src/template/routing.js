import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Transaksi from '../pages/Transaksi';
import StokBarang from '../pages/StokBarang';
import BarangMasuk from '../pages/BarangMasuk';
import DetailTransaksi from '../pages/DetailTransaksi';
import Login from '../auth/login';
import Register from '../auth/register';
import '../komponen/styles.css';
import '../komponen/style.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
// import Pelanggan from '../pages/Pelanggan';

function Routing() {
  const [isSidebarToggled, setIsSidebarToggled] = useState(false);

  useEffect(() => {
    // Check local storage and set the initial state
    const storedToggle = localStorage.getItem('sb|sidebar-toggle') === 'true';
    setIsSidebarToggled(storedToggle);

    // Add event listener to the window
    window.addEventListener('DOMContentLoaded', handleSidebarToggle);

    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener('DOMContentLoaded', handleSidebarToggle);
    };
  }, []);

  useEffect(() => {
    document.body.classList.toggle('sb-sidenav-toggled', isSidebarToggled);
    localStorage.setItem('sb|sidebar-toggle', isSidebarToggled.toString());
  }, [isSidebarToggled]);

  const handleSidebarToggle = () => {
    setIsSidebarToggled((prevToggle) => !prevToggle);
  };

  const token = localStorage.getItem('token');
  const isLoggedIn = !!token;

  const handleLogout = () => {
    localStorage.removeItem('token');
    console.log('berhasil logout');
    window.location.reload();
  };

  return (
    <Router>
      <div>
        <nav className="sb-topnav navbar navbar-expand navbar-dark bg-dark">
          <Link className="navbar-brand ps-3">Kasir</Link>
          <button className="btn btn-link btn-sm order-1 order-lg-0 me-4 me-lg-0" id="sidebarToggle" onClick={handleSidebarToggle}>
            <i className="fas fa-bars"></i>
          </button>
        </nav>

        <div id="layoutSidenav">
          <div id="layoutSidenav_nav">
            <nav className="sb-sidenav accordion sb-sidenav-dark" id="sidenavAccordion">
              <div className="sb-sidenav-menu">
                <div className="nav">
                  <div className="sb-sidenav-menu-heading">Menu</div>
                  <Link className="nav-link" to="/transaksi">
                    <div className="sb-nav-link-icon">
                      <i className="fas fa-clipboard-list"></i>
                    </div>
                    Transaksi
                  </Link>
                  <Link className="nav-link" to="/stokbarang">
                    <div className="sb-nav-link-icon">
                      <i className="fas fa-warehouse"></i>
                    </div>
                    Stok Barang
                  </Link>
                  <Link className="nav-link" to="/barangmasuk">
                    <div className="sb-nav-link-icon">
                      <i className="fas fa-truck"></i>
                    </div>
                    Barang Masuk
                  </Link>
                  {isLoggedIn ? (
                    <li className="nav-item">
                      <Link className="nav-link" onClick={handleLogout}>
                        logout
                      </Link>
                    </li>
                  ) : (
                    <li className="nav-item">
                      <Link className="nav-link" to="/">
                        login
                      </Link>
                    </li>
                  )}
                </div>
              </div>
            </nav>
          </div>

          <div id="layoutSidenav_content" className={`content-wrapper ${isSidebarToggled ? 'full-width' : ''}`}>
            <Routes>
              <Route path="/transaksi" element={<Transaksi />} />
              <Route path="/stokbarang" element={<StokBarang />} />
              <Route path="/barangmasuk" element={<BarangMasuk />} />
              {/* <Route path="/pelanggan" element={<Pelanggan />} /> */}
              <Route path="/detailTransaksi/:id" element={<DetailTransaksi />} />
              <Route path="/" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default Routing;
