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
    setDoc
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
      const docRef = await addDoc(collection(db, 'groups', groupId, 'expenses'), expenseData);
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
  export const inviteUserToGroup = async (groupId, email) => {
    try {
      const userQuery = query(collection(db, 'users'), where('email', '==', email));
      const userSnapshot = await getDocs(userQuery);
      
      if (userSnapshot.empty) {
        // ユーザーが存在しない場合、仮のユーザーを作成
        const newUserRef = doc(collection(db, 'users'));
        await setDoc(newUserRef, { email, username: email.split('@')[0] });
        const userId = newUserRef.id;
        
        const groupDoc = await getDoc(doc(db, 'groups', groupId));
        if (!groupDoc.exists()) {
          throw new Error('グループが見つかりません');
        }
        const groupName = groupDoc.data().name;
        
        await addDoc(collection(db, 'invitations'), {
          groupId,
          groupName,
          userId,
          email,
          status: 'pending'
        });
        
        return { status: 'created', message: '新しいユーザーが作成され、招待が送信されました' };
      } else {
        const userId = userSnapshot.docs[0].id;
        const groupDoc = await getDoc(doc(db, 'groups', groupId));
        if (!groupDoc.exists()) {
          throw new Error('グループが見つかりません');
        }
        const groupName = groupDoc.data().name;
        
        // 既存の招待をチェック
        const invitationQuery = query(
          collection(db, 'invitations'),
          where('groupId', '==', groupId),
          where('userId', '==', userId),
          where('status', '==', 'pending')
        );
        const invitationSnapshot = await getDocs(invitationQuery);
        
        if (!invitationSnapshot.empty) {
          return { status: 'existing', message: 'このユーザーは既に招待されています' };
        }
        
        await addDoc(collection(db, 'invitations'), {
          groupId,
          groupName,
          userId,
          email,
          status: 'pending'
        });
        
        return { status: 'invited', message: '招待が送信されました' };
      }
    } catch (error) {
      console.error('招待エラー:', error);
      throw error;
    }
  };
  export const getInvitations = async (user) => {
    try {
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
      throw error;
    }
  };
  export const acceptInvitation = async (invitationId, userId) => {
    try {
      const invitationDoc = await getDoc(doc(db, 'invitations', invitationId));
      if (invitationDoc.exists()) {
        const { groupId } = invitationDoc.data();
        
        // グループにユーザーを追加
        await updateDoc(doc(db, 'groups', groupId), {
          members: arrayUnion(userId)
        });
  
        // 招待のステータスを更新
        await updateDoc(doc(db, 'invitations', invitationId), { status: 'accepted' });
  
        // グループの詳細を取得して返す
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
      throw error;
    }
  };
  
  export const joinGroup = async (groupId, userId) => {
    try {
      await updateDoc(doc(db, 'groups', groupId), {
        members: arrayUnion(userId)
      });
    } catch (error) {
      throw error;
    }
  };