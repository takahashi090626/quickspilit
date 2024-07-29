import React, { useState } from 'react';
import { addExpense } from '../utils/database';
import { auth } from '../firebaseConfig';

const ExpenseInput = ({ groupId }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');

  const handleAddExpense = async () => {
    try {
      const userId = auth.currentUser.uid;
      const expenseData = {
        description,
        amount: parseFloat(amount),
        category,
        paidBy: userId,
        createdAt: new Date()
      };
      await addExpense(groupId, expenseData);
      setDescription('');
      setAmount('');
      setCategory('');
      // TODO: Add notification of success
    } catch (error) {
      console.error('Error adding expense:', error);
      // TODO: Add error handling
    }
  };

  return (
    <div>
      <h2>Add Expense</h2>
      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
      />
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Amount"
      />
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="">Select Category</option>
        <option value="food">Food</option>
        <option value="transportation">Transportation</option>
        <option value="accommodation">Accommodation</option>
        <option value="other">Other</option>
      </select>
      <button onClick={handleAddExpense}>Add Expense</button>
    </div>
  );
};

export default ExpenseInput;