import { doc, collection, getDoc, setDoc } from 'firebase/firestore';
import { firestore } from '../firebase/config';

// Function to log errors
const logError = (error) => {
  console.error('Error adding document: ', error);
};

export const AddStock = (formData, type, userData, date) => {
  return new Promise((resolve, reject) => {
    const MonthYear = date.toLocaleDateString('en-GB', {
      month: 'short',
      year: 'numeric',
    });

    const transactionRef = doc(collection(firestore, `inventory-${userData.id}`, MonthYear, type));

    const summaryRef = doc(firestore, `summaries-${userData.id}`, 'inventory', MonthYear, type);

    const netSummaryRef = doc(firestore, `summaries-${userData.id}`, 'inventory', MonthYear, 'net');

    // Update summary document
    getDoc(summaryRef)
      .then((docSnapshot) => {
        return updateSummary({ docSnapshot, formData, summaryRef });
      })
      .then(() => {
        return getDoc(netSummaryRef).then((docSnapshot) => {
          return updateSummary({
            docSnapshot,
            formData,
            summaryRef: netSummaryRef,
          });
        });
      })
      // eslint-disable-next-line consistent-return
      .then(() => {
        switch (type) {
          case 'pesticides':
            return setDoc(transactionRef, {
              category: type,
              type: formData.type,
              name: formData.name,
              company: formData.company,
              packingSize: formData.packingSize,
              batchNumber: formData.batchNumber,
              state: formData.state,
              purchasePrice: parseFloat(formData.purchasePrice),
              quantity: parseFloat(formData.quantity),
              sellingPrice: parseFloat(formData.sellingPrice),
              totalCost: parseFloat(formData.totalCost),
              estimatedprofit: parseFloat(formData.estimatedprofit),
              manufacturingDate: formData.manufacturingDate,
              expiryDate: formData.expiryDate,
              date,
            });

          case 'fertilizers':
            return setDoc(transactionRef, {
              category: type,
              type: formData.type,
              name: formData.name,
              company: formData.company,
              packingSize: formData.packingSize,
              state: formData.state,
              purchasePrice: parseFloat(formData.purchasePrice),
              quantity: parseFloat(formData.quantity),
              sellingPrice: parseFloat(formData.sellingPrice),
              totalCost: parseFloat(formData.totalCost),
              estimatedprofit: parseFloat(formData.estimatedprofit),
              manufacturingDate: formData.manufacturingDate,
              expiryDate: formData.expiryDate,
              date,
            });

          default:
            return setDoc(transactionRef, {
              season: formData.season,
              crop: formData.crop,
              variety: formData.variety,
              company: formData.company,
              batchNumber: formData.batchNumber,
              packingSize: parseFloat(formData.packingSize),
              quantity: parseFloat(formData.quantity),
              purchasePrice: parseFloat(formData.purchasePrice),
              sellingPrice: parseFloat(formData.sellingPrice),
              totalCost: parseFloat(formData.totalCost),
              estimatedprofit: parseFloat(formData.estimatedprofit),
              manufacturingDate: formData.manufacturingDate,
              expiryDate: formData.expiryDate,
              date,
              category: type,
            });
        }
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

export function updateSummary({ docSnapshot, formData, summaryRef, remove }) {
  let totalCost = 0;
  let totalEstimatedProfit = 0;
  if (docSnapshot.exists()) {
    const data = docSnapshot.data();
    totalCost = data.totalCost || 0;
    totalEstimatedProfit = data.totalEstimatedProfit || 0;
  }
  if (remove) {
    totalCost -= parseFloat(formData.totalCost);
    totalEstimatedProfit -= parseFloat(formData.estimatedprofit);
  } else {
    totalCost += parseFloat(formData.totalCost);
    totalEstimatedProfit += parseFloat(formData.estimatedprofit);
  }
  return setDoc(summaryRef, { totalCost, totalEstimatedProfit });
}
