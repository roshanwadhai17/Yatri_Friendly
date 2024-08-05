import React, { useState, useEffect } from 'react';
import UserService from '../service/UserService';
import { Link } from 'react-router-dom';
import './Profile.css';

function ProfilePage() {
  const [profileInfo, setProfileInfo] = useState({});

  useEffect(() => {
    fetchProfileInfo();
  }, []);

  const fetchProfileInfo = async () => {
    try {
      const token = localStorage.getItem('token'); 
      const response = await UserService.getYourProfile(token);
      setProfileInfo(response.ourUsers);
    } catch (error) {
      console.error('Error fetching profile information:', error);
    }
  };

  return (
    <div className="profile-page-container">
      <div className="profile-card">
        <div className="profile-header">
          <h2>Profile Information</h2>
        </div>
        <div className="profile-body">
          <p><span className="profile-label">First Name:</span> {profileInfo.firstName}</p>
          <p><span className="profile-label">Last Name:</span> {profileInfo.lastName}</p>
          <p><span className="profile-label">Email:</span> {profileInfo.email}</p>
          <p><span className="profile-label">City:</span> {profileInfo.city}</p>
        </div>
        {profileInfo.role === "ADMIN" && (
          <div className="profile-footer">
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfilePage;
