import React, { useState } from 'react';
import { createGroup } from '../utils/database';
import { auth } from '../firebaseConfig';

const GroupCreation = () => {
  const [groupName, setGroupName] = useState('');

  const handleCreateGroup = async () => {
    try {
      const userId = auth.currentUser.uid;
      const groupData = {
        name: groupName,
        members: [userId],
        createdAt: new Date(),
        createdBy: userId
      };
      await createGroup(groupData);
      setGroupName('');
      // TODO: Add notification of success and navigation
    } catch (error) {
      console.error('Error creating group:', error);
      // TODO: Add error handling
    }
  };

  return (
    <div>
      <h2>Create New Group</h2>
      <input
        type="text"
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
        placeholder="Group Name"
      />
      <button onClick={handleCreateGroup}>Create Group</button>
    </div>
  );
};

export default GroupCreation;