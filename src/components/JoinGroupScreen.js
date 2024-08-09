import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getGroupDetails, joinGroup } from '../utils/database';
import { auth } from '../firebaseConfig';
import { Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { styled } from '@mui/system';
import QrScanner from 'react-qr-scanner';

const StyledBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: '#f5f5f5',
  borderRadius: theme.shape.borderRadius,
}));

const JoinGroupScreen = () => {
  const [groupDetails, setGroupDetails] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const { groupId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (groupId) {
      fetchGroupDetails(groupId);
    } else {
      setIsScanning(true);
    }
  }, [groupId]);

  const fetchGroupDetails = async (id) => {
    try {
      const details = await getGroupDetails(id);
      setGroupDetails(details);
      setShowConfirmDialog(true);
    } catch (error) {
      console.error('グループ詳細の取得に失敗しました:', error);
      alert('グループ情報の取得に失敗しました。');
    }
  };

  const handleScan = (data) => {
    if (data) {
      const scannedId = extractGroupIdFromUrl(data.text);
      fetchGroupDetails(scannedId);
      setIsScanning(false);
    }
  };

  const handleError = (err) => {
    console.error(err);
    alert('QRコードのスキャンに失敗しました。もう一度お試しください。');
  };

  const handleJoinGroup = async () => {
    try {
      if (!auth.currentUser) {
        navigate('/login', { state: { from: `/join/${groupDetails.id}` } });
        return;
      }
      await joinGroup(groupDetails.id, auth.currentUser.uid);
      navigate(`/group/${groupDetails.id}`);
    } catch (error) {
      console.error('グループ参加エラー:', error);
      alert('グループへの参加に失敗しました');
    }
  };

  const handleDecline = () => {
    setShowConfirmDialog(false);
    setGroupDetails(null);
    setIsScanning(true);
  };

  const extractGroupIdFromUrl = (url) => {
    const parts = url.split('/');
    return parts[parts.length - 1];
  };

  return (
    <StyledBox>
      <Typography variant="h4" gutterBottom>グループに参加</Typography>
      {isScanning ? (
        <>
          <Typography variant="body1" gutterBottom>QRコードをスキャンしてグループに参加</Typography>
          <QrScanner
            delay={300}
            onError={handleError}
            onScan={handleScan}
            style={{ width: '100%', maxWidth: 400 }}
          />
        </>
      ) : !groupDetails ? (
        <Typography>Loading...</Typography>
      ) : (
        <Dialog open={showConfirmDialog} onClose={() => setShowConfirmDialog(false)}>
          <DialogTitle>グループに参加しますか？</DialogTitle>
          <DialogContent>
            <Typography>{groupDetails.name}グループに参加しますか？</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDecline}>参加しない</Button>
            <Button onClick={handleJoinGroup} color="primary">参加する</Button>
          </DialogActions>
        </Dialog>
      )}
    </StyledBox>
  );
};

export default JoinGroupScreen;