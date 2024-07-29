import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getGroupDetails, joinGroup } from '../utils/database';
import { auth } from '../firebaseConfig';
import { Box, Typography, Button } from '@mui/material';
import { styled } from '@mui/system';

const StyledBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: '#f5f5f5',
  borderRadius: theme.shape.borderRadius,
}));

const JoinGroupScreen = () => {
  const [groupDetails, setGroupDetails] = useState(null);
  const { groupId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGroupDetails = async () => {
      const details = await getGroupDetails(groupId);
      setGroupDetails(details);
    };

    fetchGroupDetails();
  }, [groupId]);

  const handleJoinGroup = async () => {
    try {
      await joinGroup(groupId, auth.currentUser.uid);
      navigate(`/group/${groupId}`);
    } catch (error) {
      console.error('グループ参加エラー:', error);
      alert('グループへの参加に失敗しました');
    }
  };

  if (!groupDetails) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <StyledBox>
      <Typography variant="h4" gutterBottom>グループに参加</Typography>
      <Typography variant="body1" gutterBottom>
        {groupDetails.name}グループに参加しますか？
      </Typography>
      <Button variant="contained" color="primary" onClick={handleJoinGroup}>
        参加する
      </Button>
      <Button variant="outlined" color="secondary" onClick={() => navigate('/')} sx={{ ml: 2 }}>
        キャンセル
      </Button>
    </StyledBox>
  );
};

export default JoinGroupScreen;