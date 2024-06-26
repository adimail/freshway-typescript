import { useState, useEffect, useContext } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '../../firebase/config';
import { UserDataContext } from '../../context/UserDataContext';

export const useSummaryData = (monthYear, type, refreshTrigger) => {
  const { userData } = useContext(UserDataContext)!;
  const [summaryData, setSummaryData] = useState({
    totalCost: 0,
    totalEstimatedProfit: 0,
  });
  const [loading, setLoading] = useState(true);

  const [totalExpense, setTotalExpense] = useState(0);
  const [totalCredit, setTotalCredit] = useState(0);

  const fetchShopSummaryData = async (dataType) => {
    try {
      const summaryRef = doc(
        firestore,
        `summaries-${userData.id}`,
        dataType,
        monthYear,
        'Aggregate'
      );
      const summarySnapshot = await getDoc(summaryRef);
      if (summarySnapshot.exists()) {
        const summaryData = summarySnapshot.data();
        if (dataType === 'Sell') {
          setTotalExpense(summaryData.sum || 0);
        } else if (dataType === 'Credit') {
          setTotalCredit(summaryData.sum || 0);
        }
      }
    } catch (error) {
      console.error('Error fetching summary data:', error);
    }
  };

  useEffect(() => {
    const fetchSummaryData = async () => {
      const summaryRef = doc(firestore, `summaries-${userData.id}`, 'inventory', monthYear, type);
      try {
        const docSnapshot = await getDoc(summaryRef);
        if (docSnapshot.exists()) {
          setSummaryData(docSnapshot.data());
        } else {
          setSummaryData({ totalCost: 0, totalEstimatedProfit: 0 });
        }
      } catch (error) {
        console.error('Error fetching summary documents: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSummaryData();

    fetchShopSummaryData('sell');
    fetchShopSummaryData('credit');
  }, [refreshTrigger]);

  return { summaryData, loading, totalExpense, totalCredit };
};
