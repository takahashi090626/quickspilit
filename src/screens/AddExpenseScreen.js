import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../index.css'; // スタイルのインポート

const AddExpenseScreen = () => {
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const navigate = useNavigate();

    const handleAddExpense = () => {
        // Add expense logic here
        navigate('/group');
    };

    return (
        <div className="container" id="add-expense-screen">
            <div className="header">
                <h1>支出を追加</h1>
            </div>
            <div className="input-group">
                <label htmlFor="description">説明</label>
                <input
                    type="text"
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="例: 夕食代"
                />
            </div>
            <div className="input-group">
                <label htmlFor="amount">金額</label>
                <input
                    type="number"
                    id="amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="例: 5000"
                />
            </div>
            <button onClick={handleAddExpense} className="button">支出を追加</button>
        </div>
    );
};

export default AddExpenseScreen;
