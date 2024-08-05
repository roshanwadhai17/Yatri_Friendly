import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import LoginPage from './components/auth/LoginPage';
import RegistrationPage from './components/auth/RegistrationPage';
import FooterComponent from './components/common/Footer';
import UserService from './components/service/UserService';
import UpdateUser from './components/userspage/UpdateUser';
import TransactionsPage from './components/Dashboard/TransactionsPage';
import UserManagementPage from './components/userspage/UserManagementPage';
import ProfilePage from './components/userspage/ProfilePage';
import Dashboard from './components/Dashboard/Dashboard';
import AuthContext from './components/common/AuthContext';
import AddTransactionPage from './components/Dashboard/AddTransactionPage';

const ProtectedRoute = ({ element }) => {
  return UserService.isAuthenticated() ? element : <Navigate to="/login" />;
};

const AdminRoute = ({ element }) => {
  return UserService.adminOnly() ? element : <Navigate to="/login" />;
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(UserService.isAuthenticated());
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      <div className="App">
        {isLoggedIn && <Navbar />} {/* Render Navbar conditionally */}
        <div className="content">
          <Routes>
            <Route exact path="/login" element={<LoginPage />} />
            <Route exact path="/logout" element={<LoginPage />} />
            <Route path="/profile" element={<ProtectedRoute element={<ProfilePage />} />} />
            <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
            <Route path="/transactions/:userId" element={<ProtectedRoute element={<TransactionsPage />} />} /> {/* New route for TransactionsPage */}
            <Route path="/register" element={<AdminRoute element={<RegistrationPage />} />} />
            <Route path="/transactions" element={<AdminRoute element={<AddTransactionPage />} />} />
            <Route path="/add-transaction/:userId" element={<AdminRoute element={<AddTransactionPage />} />} />
            <Route path="/admin/user-management" element={<AdminRoute element={<UserManagementPage />} />} />
            <Route path="/update-user/:userId" element={<AdminRoute element={<UpdateUser />} />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </div>
        {isLoggedIn && <FooterComponent />}
      </div>
    </AuthContext.Provider>
  );
}

export default App;
