import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import UserService from '../service/UserService';
import './Dashboard.css';

const Dashboard = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await UserService.getAllUsers(token);

                if (response.statusCode === 200 && response.ourUsersList) {
                    setUsers(response.ourUsersList);
                } else {
                    console.error('Unexpected response structure:', response);
                    setError('Unexpected response structure');
                }
            } catch (error) {
                console.error('Error fetching users:', error);
                setError('Error fetching users');
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    if (loading) {
        return <p className="loading">Loading...</p>;
    }

    if (error) {
        return <p className="error">Error: {error}</p>;
    }

    // Filter users to display only those with the role "USER"
    const filteredUsers = users.filter(user => user.role === 'USER');

    return (
        <div className="dashboard-container">
            <h2>Dashboard</h2>
            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Email</th>
                            <th>Password</th>
                            <th>City</th>
                            <th>Role</th>
                            <th>Username</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Phone Number</th>
                            <th>Registration Date</th>
                            <th>Type</th>
                            <th>Company Name</th>
                            <th>Add Transactions</th> 
                            <th>Transactions Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.length > 0 ? (
                            filteredUsers.map(user => (
                                <tr key={user.id}>
                                    <td>{user.id}</td>
                                    <td>{user.email}</td>
                                    <td>{user.password}</td>
                                    <td>{user.city}</td>
                                    <td>{user.role}</td>
                                    <td>{user.username}</td>
                                    <td>{user.firstName}</td>
                                    <td>{user.lastName}</td>
                                    <td>{user.phoneNumber}</td>
                                    <td>{user.dateOfRegistration}</td>
                                    <td>{user.type}</td>
                                    <td>{user.company ? user.company.companyName : ''}</td>
                                    <td>
                                      <Link to={`/add-transaction/${user.id}`}>Add Transaction</Link> {/* New link */}  
                                    </td>
                                    <td>
                                      <Link to={`/transactions/${user.id}`}>View Transactions</Link>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="14" className="no-users">No users found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Dashboard;
