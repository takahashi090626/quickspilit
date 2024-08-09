import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Typography } from '@mui/material';
import QrScanner from 'react-qr-scanner';
import { auth } from '../firebaseConfig';
import { joinGroup } from '../utils/database';

const QRCodeJoinFlow = () => {
  const [scannedGroupId, setScannedGroupId] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isScanning, setIsScanning] = useState(true);
  const navigate = useNavigate();
  const { groupId } = useParams();

  useEffect(() => {
    if (groupId) {
      setScannedGroupId(groupId);
      setShowConfirmDialog(true);
      setIsScanning(false);
    }
  }, [groupId]);

  const handleScan = (data) => {
    if (data) {
      const scannedId = extractGroupIdFromUrl(data.text);
      setScannedGroupId(scannedId);
      setShowConfirmDialog(true);
      setIsScanning(false);
    }
  };

  const handleError = (err) => {
    console.error(err);
    // エラーメッセージを表示するなどの処理を追加
  };

  const handleJoinGroup = async () => {
    try {
      if (!auth.currentUser) {
        navigate('/login', { state: { from: `/join/${scannedGroupId}` } });
        return;
      }
      await joinGroup(scannedGroupId, auth.currentUser.uid);
      navigate(`/group/${scannedGroupId}`);
    } catch (error) {
      console.error('グループ参加エラー:', error);
      // エラーメッセージを表示するなどの処理を追加
    }
  };

  const handleDecline = () => {
    setShowConfirmDialog(false);
    navigate('/');
  };

  const extractGroupIdFromUrl = (url) => {
    const parts = url.split('/');
    return parts[parts.length - 1];
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 2 }}>
      <Typography variant="h5" gutterBottom>QRコードをスキャンしてグループに参加</Typography>
      {isScanning && (
        <QrScanner
          delay={300}
          onError={handleError}
          onScan={handleScan}
          style={{ width: '100%', maxWidth: 400 }}
        />
      )}
      <Dialog open={showConfirmDialog} onClose={() => setShowConfirmDialog(false)}>
        <DialogTitle>グループに参加しますか？</DialogTitle>
        <DialogContent>
          スキャンしたQRコードのグループに参加しますか？
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDecline}>参加しない</Button>
          <Button onClick={handleJoinGroup} color="primary">参加する</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default QRCodeJoinFlow;