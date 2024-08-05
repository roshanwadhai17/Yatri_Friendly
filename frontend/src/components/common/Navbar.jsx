import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import UserService from '../service/UserService';
import './Navbar.css';
import AuthContext from './AuthContext';

const Navbar = ({ onSearch }) => {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const { setIsLoggedIn } = useContext(AuthContext);

  useEffect(() => {
    setIsAdmin(UserService.adminOnly());
  }, []);

  const handleLogout = () => {
    UserService.logout();
    setIsLoggedIn(false);
    navigate('/login');
  };

  const handleInputChange = (e) => {
    const text = e.target.value;
    setSearchText(text);
    onSearch(text);
  };

  return (
    <nav className="nav">
      <div className="nav-left">
        <Link to="/" className="logo">
          <i className="fas fa-user-travel"></i> {/* Add your own icon or replace with suitable one */}
          यात्री Friendly
        </Link>
        <ul>
          <li><Link to="/dashboard"><i className="fas fa-home"></i> Home</Link></li>
          {isAdmin && <li><Link to="/admin/user-management"><i className="fas fa-users-cog"></i> Manage Users</Link></li>}
        </ul>
      </div>
      <div className="nav-right">
        <ul>
          <li><Link to="/profile"><i className="fas fa-user"></i> Profile</Link></li>
          <li><button onClick={handleLogout} className="logout-btn"><i className="fas fa-sign-out-alt"></i> Logout</button></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
