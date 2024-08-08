import { 
    collection, 
    addDoc, 
    updateDoc, 
    deleteDoc, 
    doc, 
    getDocs, 
    query, 
    where,
    getDoc,
    arrayUnion,
    limit
  } from 'firebase/firestore';
  import { db } from '../firebaseConfig';
  
  export const createGroup = async (groupData) => {
    try {
      const docRef = await addDoc(collection(db, 'groups'), groupData);
      return docRef.id;
    } catch (error) {
      throw error;
    }
  };
  
  export const getGroups = async (userId) => {
    try {
      const q = query(collection(db, 'groups'), where('members', 'array-contains', userId));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      throw error;
    }
  };
  
  export const addExpense = async (groupId, expenseData) => {
    try {
      const docRef = await addDoc(collection(db, 'groups', groupId, 'expenses'), {
        ...expenseData,
        paidStatus: {} // 各ユーザーの支払い状態を格納するオブジェクト
      });
      return docRef.id;
    } catch (error) {
      throw error;
    }
  };
  
  export const getExpenses = async (groupId) => {
    try {
      const querySnapshot = await getDocs(collection(db, 'groups', groupId, 'expenses'));
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      throw error;
    }
  };
  
  export const updateExpense = async (groupId, expenseId, expenseData) => {
    try {
      await updateDoc(doc(db, 'groups', groupId, 'expenses', expenseId), expenseData);
    } catch (error) {
      throw error;
    }
  };
  
  export const deleteExpense = async (groupId, expenseId) => {
    try {
      await deleteDoc(doc(db, 'groups', groupId, 'expenses', expenseId));
    } catch (error) {
      throw error;
    }
  };
  
  export const getGroupMembers = async (groupId) => {
    try {
      const groupDoc = await getDoc(doc(db, 'groups', groupId));
      if (groupDoc.exists()) {
        const memberIds = groupDoc.data().members;
        const memberPromises = memberIds.map(async (memberId) => {
          const userDoc = await getDoc(doc(db, 'users', memberId));
          return { id: memberId, ...userDoc.data() };
        });
        return Promise.all(memberPromises);
      }
      return [];
    } catch (error) {
      throw error;
    }
  };
  
  export const inviteUserToGroup = async (groupId, userId) => {
    try {
      // グループドキュメントの参照を取得
      const groupRef = doc(db, 'groups', groupId);
      
      // グループドキュメントを取得
      const groupDoc = await getDoc(groupRef);
      
      if (!groupDoc.exists()) {
        throw new Error('指定されたグループが存在しません。');
      }
      
      // ユーザードキュメントの参照を取得
      const userRef = doc(db, 'users', userId);
      
      // ユーザードキュメントを取得
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        throw new Error('指定されたユーザーが存在しません。');
      }
      
      // 既存の招待をチェック
      const invitationsRef = collection(db, 'invitations');
      const q = query(invitationsRef, 
        where('groupId', '==', groupId),
        where('userId', '==', userId),
        where('status', '==', 'pending')
      );
      const existingInvitations = await getDocs(q);
      
      if (!existingInvitations.empty) {
        return { message: 'このユーザーは既に招待されています。' };
      }
      
      // 新しい招待を作成
      await addDoc(invitationsRef, {
        groupId,
        userId,
        groupName: groupDoc.data().name,
        status: 'pending',
        createdAt: new Date()
      });
      
      return { message: 'ユーザーに招待を送信しました。' };
    } catch (error) {
      console.error('招待エラー:', error);
      throw new Error(`ユーザーの招待に失敗しました: ${error.message}`);
    }
  };
  export const getInvitations = async (user) => {
    try {
      if (!user || !user.uid) {
        console.error('Invalid user object');
        return [];
      }
  
      const userIdQuery = query(
        collection(db, 'invitations'), 
        where('userId', '==', user.uid), 
        where('status', '==', 'pending')
      );
      const emailQuery = query(
        collection(db, 'invitations'), 
        where('email', '==', user.email), 
        where('status', '==', 'pending')
      );
  
      const [userIdSnapshot, emailSnapshot] = await Promise.all([
        getDocs(userIdQuery),
        getDocs(emailQuery)
      ]);
  
      const invitations = [...userIdSnapshot.docs, ...emailSnapshot.docs]
        .map(doc => ({ id: doc.id, ...doc.data() }));
  
      return invitations;
    } catch (error) {
      console.error('招待の取得エラー:', error);
      return [];
    }
  };
  
  export const acceptInvitation = async (invitationId, userId) => {
    try {
      const invitationDoc = await getDoc(doc(db, 'invitations', invitationId));
      if (invitationDoc.exists()) {
        const { groupId } = invitationDoc.data();
        
        await updateDoc(doc(db, 'groups', groupId), {
          members: arrayUnion(userId)
        });
  
        await updateDoc(doc(db, 'invitations', invitationId), { status: 'accepted' });
  
        const groupDoc = await getDoc(doc(db, 'groups', groupId));
        return { id: groupId, ...groupDoc.data() };
      }
      throw new Error('招待が見つかりません');
    } catch (error) {
      console.error('招待の受諾エラー:', error);
      throw error;
    }
  };
  
  export const declineInvitation = async (invitationId) => {
    try {
      await updateDoc(doc(db, 'invitations', invitationId), { status: 'declined' });
    } catch (error) {
      console.error('招待の拒否エラー:', error);
      throw error;
    }
  };
  
  export const getGroupDetails = async (groupId) => {
    try {
      const groupDoc = await getDoc(doc(db, 'groups', groupId));
      if (groupDoc.exists()) {
        return { id: groupDoc.id, ...groupDoc.data() };
      }
      throw new Error('グループが見つかりません');
    } catch (error) {
      console.error('グループ詳細取得エラー:', error);
      throw error;
    }
  };
  
  export const joinGroup = async (groupId, userId) => {
    try {
      await updateDoc(doc(db, 'groups', groupId), {
        members: arrayUnion(userId)
      });
    } catch (error) {
      console.error('グループ参加エラー:', error);
      throw error;
    }
  };
  
  export const updateExpensePaidStatus = async (groupId, expenseId, userId, isPaid) => {
    try {
      const expenseRef = doc(db, 'groups', groupId, 'expenses', expenseId);
      await updateDoc(expenseRef, {
        [`paidStatus.${userId}`]: isPaid
      });
    } catch (error) {
      console.error('支払い状態更新エラー:', error);
      throw error;
    }
  };
  
  export const updateUserPaymentStatus = async (groupId, userId, isPaid) => {
    try {
      const groupRef = doc(db, 'groups', groupId);
      await updateDoc(groupRef, {
        [`memberPaymentStatus.${userId}`]: isPaid
      });
    } catch (error) {
      console.error('ユーザー支払い状態更新エラー:', error);
      throw error;
    }
  };
  
  export const deleteGroup = async (groupId) => {
    try {
      await deleteDoc(doc(db, 'groups', groupId));
    } catch (error) {
      console.error('グループ削除エラー:', error);
      throw error;
    }
  };
  export const searchUsers = async (searchTerm) => {
    try {
      const usersRef = collection(db, 'users');
      const q = query(
        usersRef,
        where('userId', '>=', searchTerm),
        where('userId', '<=', searchTerm + '\uf8ff'),
        limit(10) // 結果の数を制限
      );
  
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('ユーザー検索エラー:', error);
      throw new Error('ユーザーの検索中にエラーが発生しました。');
    }
  };
  