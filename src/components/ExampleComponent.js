// src/components/ExampleComponent.js

import React, { useEffect, useState } from 'react';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

const ExampleComponent = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, 'your-collection'));
      const dataList = querySnapshot.docs.map(doc => doc.data());
      setData(dataList);
    };

    fetchData();
  }, []);

  const handleAddData = async () => {
    await addDoc(collection(db, 'your-collection'), {
      name: 'New Item',
      description: 'This is a new item'
    });
  };

  return (
    <div>
      <button onClick={handleAddData}>Add Data</button>
      <ul>
        {data.map((item, index) => (
          <li key={index}>{item.name}: {item.description}</li>
        ))}
      </ul>
    </div>
  );
};

export default ExampleComponent;
    