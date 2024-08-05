import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import UserService from '../service/UserService';
import './AddTransactionPage.css';

const AddTransactionPage = () => {
  const { userId } = useParams(); // Get userId from route parameters
  const [date, setDate] = useState('');
  const [amount, setAmount] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleAddTransaction = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      const token = localStorage.getItem('token');
      const transaction = {
        date,
        amount,
        transactionId
      };
      const response = await UserService.addTransaction(userId, transaction, token);

      if (response.statusCode === 200) {
        setMessage('Transaction added successfully');
      } else {
        setError('Failed to add transaction');
      }
    } catch (err) {
      setError('Error adding transaction');
    }
  };

  return (
    <div className="add-transaction-page-container">
      <h2>Add Transaction</h2>
      <form onSubmit={handleAddTransaction}>
        <label>
          Date:
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </label>
        <label>
          Amount:
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </label>
        <label>
          Transaction ID:
          <input
            type="text"
            value={transactionId}
            onChange={(e) => setTransactionId(e.target.value)}
            required
          />
        </label>
        <button type="submit">Add Transaction</button>
      </form>
      {message && <p className="message">{message}</p>}
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default AddTransactionPage;
