import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import UserService from '../service/UserService';
import './TransactionsPage.css';

const TransactionsPage = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [noTransactions, setNoTransactions] = useState(false);

  useEffect(() => {
    const fetchUserAndTransactions = async () => {
      try {
        const token = localStorage.getItem('token');
        
        // Fetch user details
        const userResponse = await UserService.getUserById(userId, token);
        if (userResponse.statusCode === 200 && userResponse.ourUsers) {
          setUser(userResponse.ourUsers);
        } else {
          console.error('Error fetching user details:', userResponse);
          setError('Error fetching user details');
        }

        // Fetch transactions
        const transactionsResponse = await UserService.getAllTransactions(userId, token);
        if (transactionsResponse.statusCode === 200 && transactionsResponse.transactions) {
          if (transactionsResponse.transactions.length === 0) {
            setNoTransactions(true);
          } else {
            setTransactions(transactionsResponse.transactions);
          }
        } else {
          console.error('No Transactions Found:', transactionsResponse);
          setError('No Transactions Found');
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error:', error);
        setError('Error fetching data');
        setLoading(false);
      }
    };

    fetchUserAndTransactions();
  }, [userId]);

  // Calculate total amount
  const totalAmount = transactions.reduce((total, transaction) => total + transaction.amount, 0);

  if (loading) {
    return <p className="loading">Loading...</p>;
  }

  if (error) {
    return <p className="error">{error}</p>;
  }

  if (noTransactions) {
    return <p className="no-transactions">No transactions found.</p>;
  }

  return (
    <div className="transaction-page-container">
      <div className="transaction-header">
        <h2>Transactions of {user ? `${user.firstName} ${user.lastName}` : 'Loading...'}</h2>
        <h2 style={{ textAlign: "right" }}>Total Amount: {totalAmount.toFixed(2)}</h2>
      </div>
      <div className="transaction-table-container">
        <table className="transaction-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Transaction ID</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction, index) => (
              <tr key={index}>
                <td>{transaction.id}</td>
                <td>{transaction.date}</td>
                <td>{transaction.amount}</td>
                <td>{transaction.transactionId}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionsPage;
