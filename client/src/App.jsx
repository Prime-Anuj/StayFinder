import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ListingDetail from './pages/ListingDetails';
import CreateListing from './pages/CreateListing';
import Dashboard from './pages/Dashboard';
import Bookings from './pages/Bookings';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';



function App() {
    return (
        <Router>
            <AuthProvider>
                <div className="App">
                    <Navbar />
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/listing/:id" element={<ListingDetail />} />
                        <Route
                            path="/create-listing"
                            element={
                                <ProtectedRoute>
                                    <CreateListing />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/dashboard"
                            element={
                                <ProtectedRoute>
                                    <Dashboard />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/bookings"
                            element={
                                <ProtectedRoute>
                                    <Bookings />
                                </ProtectedRoute>
                            }
                        />
                    </Routes>
                </div>
            </AuthProvider>
        </Router>
    );
}

export default App;
