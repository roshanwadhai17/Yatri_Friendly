import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import UserService from '../service/UserService';
import './UpdateUser.css';

function UpdateUser() {
  const navigate = useNavigate();
  const { userId } = useParams();

  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phoneNumber: '',
    city: '',
    role: '',
    type: '',
    company: {
      companyName: ''
    }
  });

  const [isEditable, setIsEditable] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserDataById(userId);
  }, [userId]);

  const fetchUserDataById = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await UserService.getUserById(userId, token);

      if (response && response.ourUsers) {  // Ensure you're accessing the correct field
        console.log('Fetched user data:', response);
        setUserData({
          firstName: response.ourUsers.firstName || '',
          lastName: response.ourUsers.lastName || '',
          email: response.ourUsers.email || '',
          password: response.ourUsers.password || '',
          phoneNumber: response.ourUsers.phoneNumber || '',
          city: response.ourUsers.city || '',
          role: response.ourUsers.role || '',
          type: response.ourUsers.type || '',
          company: response.ourUsers.company || { companyName: '' }
        });
      } else {
        console.error('No response data found');
        alert('Failed to fetch user data. Please try again.');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      alert('Failed to fetch user data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('company.')) {
      const companyField = name.split('.')[1];
      setUserData((prevUserData) => ({
        ...prevUserData,
        company: {
          ...prevUserData.company,
          [companyField]: value
        }
      }));
    } else {
      setUserData((prevUserData) => ({
        ...prevUserData,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const confirmUpdate = window.confirm('Are you sure you want to update this user?');
      if (confirmUpdate) {
        const token = localStorage.getItem('token');
        await UserService.updateUser(userId, userData, token);
        navigate('/admin/user-management');
      }
    } catch (error) {
      console.error('Error updating user profile:', error);
      alert('An error occurred while updating the user profile');
    }
  };

  const handleEdit = () => {
    setIsEditable(true);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="auth-container">
      <h2>Update User</h2>
      <div className="update-user-container">
        <div className="edit-form">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>First Name:</label>
              <input
                type="text"
                name="firstName"
                value={userData.firstName}
                onChange={handleInputChange}
                disabled={!isEditable}
                required
              />
            </div>
            <div className="form-group">
              <label>Last Name:</label>
              <input
                type="text"
                name="lastName"
                value={userData.lastName}
                onChange={handleInputChange}
                disabled={!isEditable}
                required
              />
            </div>
            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={userData.email}
                onChange={handleInputChange}
                disabled={!isEditable}
                required
              />
            </div>
            <div className="form-group">
              <label>Password:</label>
              <input
                type="password"
                name="password"
                value={userData.password}
                onChange={handleInputChange}
                disabled={!isEditable}
              />
            </div>
            <div className="form-group">
              <label>Phone Number:</label>
              <input
                type="tel"
                name="phoneNumber"
                value={userData.phoneNumber}
                onChange={handleInputChange}
                disabled={!isEditable}
                required
              />
            </div>
            <div className="form-group">
              <label>City:</label>
              <input
                type="text"
                name="city"
                value={userData.city}
                onChange={handleInputChange}
                disabled={!isEditable}
              />
            </div>
            <div className="form-group">
              <label>Type:</label>
              <input
                type="text"
                name="type"
                value={userData.type}
                onChange={handleInputChange}
                disabled={!isEditable}
              />
            </div>
            <div className="form-group">
              <label>Company Name:</label>
              <input
                type="text"
                name="company.companyName"
                value={userData.company.companyName}
                onChange={handleInputChange}
                disabled={!isEditable}
              />
            </div>
            <div className="form-group">
              <button type="submit" disabled={!isEditable}>
                Save Changes
              </button>
              <button type="button" onClick={handleEdit}>
                Edit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UpdateUser;
