import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignUpPage';
import ProductDashboardPage from './components/ProductDashboardPage';
import CategoryDashboardPage from './components/CategoryDashboardPage';

import { setAuthHeader } from './utils/auth';

function App() {
    setAuthHeader();

    return (
        <Router>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/register" element={<SignupPage />} />
                <Route path="/products" element={<ProductDashboardPage />} />
                <Route path="/categories" element={<CategoryDashboardPage />} /> {/* Новый маршрут */}

            </Routes>
        </Router>
    );
}

export default App;
