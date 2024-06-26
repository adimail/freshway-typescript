import { firestore } from '../firebase/config';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { Alert } from 'react-native';

const deleteQuickAdd = async (userId, title) => {
  try {
    const confirmDelete = await new Promise((resolve) =>
      Alert.alert(
        'Confirm Deletion',
        `Are you sure you want to delete the quick add "${title}"?`,
        [
          {
            text: 'Cancel',
            onPress: () => resolve(false),
            style: 'cancel',
          },
          {
            text: 'Delete',
            onPress: () => resolve(true),
          },
        ],
        { cancelable: false }
      )
    );

    if (confirmDelete) {
      const userDocRef = doc(firestore, 'users', userId);
      const userDocSnap = await getDoc(userDocRef);

      if (!userDocSnap.exists()) {
        throw new Error('User not found');
      }

      const userData = userDocSnap.data();
      const quickAdds = userData.quickadd || [];

      const updatedQuickAdds = quickAdds.filter((item) => item.title !== title);

      await updateDoc(userDocRef, { quickadd: updatedQuickAdds });

      return true;
    }
    return false;
  } catch (error) {
    console.error('Error deleting quick add:', error);
    throw error;
  }
};

export { deleteQuickAdd };
