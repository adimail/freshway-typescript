import { doc, collection, getDoc, setDoc } from 'firebase/firestore';
import { firestore } from '../firebase/config';

// Function to log errors
const logError = (error) => {
  console.error('Error adding document: ', error);
};

export const submitData = (
  type,
  title,
  amount,
  category,
  userData,
  date,
  description,
  setCurrentMonthExpense
) => {
  return new Promise((resolve, reject) => {
    const MonthYear = date.toLocaleDateString('en-GB', {
      month: 'short',
      year: 'numeric',
    });

    const transactionRef = doc(
      collection(firestore, `transactions-${userData.id}`, type, MonthYear)
    );

    const summaryRef = doc(firestore, `summaries-${userData.id}`, type, MonthYear, 'Aggregate');

    // Update summary document
    getDoc(summaryRef)
      .then((docSnapshot) => {
        let sum = 0;
        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          sum = data.sum || 0;
        }
        sum += parseInt(amount);
        setCurrentMonthExpense(sum);
        return setDoc(summaryRef, { sum });
      })
      .then(() => {
        // Add transaction data
        return setDoc(transactionRef, {
          title,
          category,
          amount: parseInt(amount),
          date,
          description,
        });
      })
      .then(() => {
        resolve(); // Resolve the promise once everything is done
      })
      .catch((error) => {
        logError(error); // Log error
        reject(error); // Reject the promise if there's an error
      });
  });
};
