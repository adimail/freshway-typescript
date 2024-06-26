import React, { useContext } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { SummaryRow, renderSummarySection } from './utils';
import { useStyles } from './styles';

import { colors } from '../../theme';
import { useSummaryData } from './useSummaryData';

interface NetSummaryComponentProps {
  refreshTrigger: number;
  time: string;
}

export const NetSummaryComponent: React.FC<NetSummaryComponentProps> = ({
  refreshTrigger,
  time,
}) => {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    summarySectionTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.tertiary,
      marginBottom: 5,
    },
    summaryTtitle: {
      fontSize: 17,
      color: 'white',
    },
    summaryAmount: {
      fontWeight: 'bold',
      fontSize: 18,
      color: 'white',
    },
    summarycard: {
      display: 'flex',
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: 30,
      alignSelf: 'center',
    },
    separator: {
      marginVertical: 15,
      height: 1,
      width: '80%',
      alignSelf: 'center',
      backgroundColor: 'white',
    },
  });

  const categories = ['net', 'seeds', 'pesticides', 'fertilizers'];
  const summaryData = categories.reduce((acc, category) => {
    acc[category] = useSummaryData(time, category, refreshTrigger).summaryData;
    return acc;
  }, {});

  const renderSummaryCard = (title, amount) => (
    <View style={styles.summarycard} key={title}>
      <Text style={styles.summaryTtitle}>{title}</Text>
      <Text style={styles.summaryAmount}>₹ {amount}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View
        style={{
          marginTop: 10,
          width: 300,
          borderRadius: 24,
          backgroundColor: colors.primaryText,
          marginBottom: 25,
          gap: 5,
          paddingVertical: 15,
          paddingHorizontal: 25,
        }}>
        <Text style={styles.summarySectionTitle}>Net Goods</Text>
        {renderSummaryCard('Total Spendings', summaryData.net.totalCost)}
        {renderSummaryCard('Estimated Profit', summaryData.net.totalEstimatedProfit)}
        <View style={styles.separator} />

        <Text style={styles.summarySectionTitle}>Expenses</Text>
        {categories
          .slice(1)
          .map((category) =>
            renderSummaryCard(
              category.charAt(0).toUpperCase() + category.slice(1),
              summaryData[category].totalCost
            )
          )}

        <Text style={styles.summarySectionTitle}>Estimated Gains</Text>
        {categories
          .slice(1)
          .map((category) =>
            renderSummaryCard(
              category.charAt(0).toUpperCase() + category.slice(1),
              summaryData[category].totalEstimatedProfit
            )
          )}
      </View>
    </View>
  );
};

export const SeedsSummary = ({ formData }) => {
  const isDark = true;
  const styles = useStyles(isDark);

  if (!formData) return null;

  const {
    season,
    crop,
    variety,
    company,
    batchNumber,
    packingSize,
    pricePerUnit,
    quantity,
    purchasePrice,
    sellingPrice,
    manufacturingDate,
    expiryDate,
    date,
    totalWeight,
    totalCost,
    estimatedprofit,
  } = formData;

  return (
    <View style={styles.summaryContainer}>
      <Text style={styles.summaryTitle}>Summary</Text>

      {renderSummarySection(
        'About Crop',
        <>
          <SummaryRow key="season" label="Season" value={season || '- '} />
          <SummaryRow key="crop" label="Crop" value={crop || '- '} />
          <SummaryRow key="variety" label="Variety" value={variety || '- '} />
          <SummaryRow key="company" label="Company" value={company || '- '} />
          <SummaryRow key="batchNumber" label="Batch Number" value={batchNumber || '- '} />
        </>
      )}

      {renderSummarySection(
        'Packaging',
        <>
          <SummaryRow key="packingSize" label="Packing Size (Kg)" value={packingSize || '- '} />
          <SummaryRow key="pricePerUnit" label="Price per Unit" value={pricePerUnit || '- '} />
          <SummaryRow key="quantity" label="Quantity" value={quantity || '- '} />
        </>
      )}

      {renderSummarySection(
        'Price',
        <>
          <SummaryRow
            key="purchasePrice"
            label="Purchase Price per Kg"
            value={purchasePrice || '- '}
          />
          <SummaryRow
            key="sellingPrice"
            label="Selling Price per Kg"
            value={sellingPrice || '- '}
          />
        </>
      )}

      {renderSummarySection(
        'Dates',
        <>
          <SummaryRow
            key="manufacturingDate"
            label="Manufacturing Date"
            value={manufacturingDate.toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
          />
          <SummaryRow
            key="expiryDate"
            label="Expiry Date"
            value={expiryDate.toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
          />
          <SummaryRow
            key="date"
            label="Date of purchase"
            value={date.toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
          />
        </>
      )}

      {renderSummarySection(
        'Invoice',
        <>
          <SummaryRow key="totalWeight" label="Total Weight" value={totalWeight} />
          <SummaryRow key="totalCost" label="Total Purchase Cost" value={totalCost} />
          <SummaryRow key="estimatedprofit" label="Estimated Profit" value={estimatedprofit} />
        </>
      )}
    </View>
  );
};

export const PesticidesSummary = ({ formData }) => {
  const isDark = true;
  const styles = useStyles(isDark);

  if (!formData) return null;

  const {
    name,
    company,
    batchNumber,
    packingSize,
    quantity,
    purchasePrice,
    sellingPrice,
    manufacturingDate,
    expiryDate,
    date,
    totalCost,
    estimatedprofit,
    state,
    type,
  } = formData;

  return (
    <View style={styles.summaryContainer}>
      <Text style={styles.summaryTitle}>Summary</Text>

      {renderSummarySection(
        'About Pesticide',
        <>
          <SummaryRow key="type" label="Type" value={type || '- '} />
          <SummaryRow key="name" label="Name" value={name || '- '} />
          <SummaryRow key="company" label="Company" value={company || '- '} />
          <SummaryRow key="batchNumber" label="Batch Number" value={batchNumber || '- '} />
        </>
      )}

      {renderSummarySection(
        'Packaging',
        <>
          <SummaryRow
            key="packingSize"
            label={`Packing Size (${state})`}
            value={packingSize || '- '}
          />
          <SummaryRow key="purchasePrice" label="Price per Unit" value={purchasePrice || '- '} />
          <SummaryRow key="quantity" label="Quantity" value={quantity || '- '} />
        </>
      )}

      {renderSummarySection(
        'Price',
        <>
          <SummaryRow key="purchasePrice" label="Purchase Price" value={purchasePrice || '- '} />
          <SummaryRow key="sellingPrice" label="Selling Price" value={sellingPrice || '- '} />
        </>
      )}

      {renderSummarySection(
        'Dates',
        <>
          <SummaryRow
            key="manufacturingDate"
            label="Manufacturing Date"
            value={manufacturingDate.toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
          />
          <SummaryRow
            key="expiryDate"
            label="Expiry Date"
            value={expiryDate.toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
          />
          <SummaryRow
            key="date"
            label="Date of purchase"
            value={date.toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
          />
        </>
      )}

      {renderSummarySection(
        'Invoice',
        <>
          <SummaryRow key="totalCost" label="Total Purchase Cost" value={totalCost || '- '} />
          <SummaryRow
            key="estimatedprofit"
            label="Estimated Profit"
            value={estimatedprofit || '- '}
          />
        </>
      )}
    </View>
  );
};

export const FertilizersSummary = ({ formData }) => {
  const isDark = true;
  const styles = useStyles(isDark);

  if (!formData) return null;

  const {
    name,
    company,
    packingSize,
    quantity,
    purchasePrice,
    sellingPrice,
    manufacturingDate,
    expiryDate,
    date,
    totalCost,
    estimatedprofit,
    state,
    type,
  } = formData;

  return (
    <View style={styles.summaryContainer}>
      <Text style={styles.summaryTitle}>Summary</Text>

      {renderSummarySection(
        'About Pesticide',
        <>
          <SummaryRow key="type" label="Type" value={type || '- '} />
          <SummaryRow key="name" label="Name" value={name || '- '} />
          <SummaryRow key="company" label="Company" value={company || '- '} />
        </>
      )}

      {renderSummarySection(
        'Packaging',
        <>
          <SummaryRow
            key="packingSize"
            label={`Packing Size (${state})`}
            value={packingSize || '- '}
          />
          <SummaryRow key="purchasePrice" label="Price per Unit" value={purchasePrice || '- '} />
          <SummaryRow key="quantity" label="Quantity" value={quantity || '- '} />
        </>
      )}

      {renderSummarySection(
        'Price',
        <>
          <SummaryRow key="purchasePrice" label="Purchase Price" value={purchasePrice || '- '} />
          <SummaryRow key="sellingPrice" label="Selling Price" value={sellingPrice || '- '} />
        </>
      )}

      {renderSummarySection(
        'Dates',
        <>
          <SummaryRow
            key="manufacturingDate"
            label="Manufacturing Date"
            value={manufacturingDate.toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
          />
          <SummaryRow
            key="expiryDate"
            label="Expiry Date"
            value={expiryDate.toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
          />
          <SummaryRow
            key="date"
            label="Date of purchase"
            value={date.toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
          />
        </>
      )}

      {renderSummarySection(
        'Invoice',
        <>
          <SummaryRow key="totalCost" label="Total Purchase Cost" value={totalCost || '- '} />
          <SummaryRow
            key="estimatedprofit"
            label="Estimated Profit"
            value={estimatedprofit || '- '}
          />
        </>
      )}
    </View>
  );
};
