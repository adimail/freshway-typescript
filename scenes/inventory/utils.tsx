/* eslint-disable indent */
import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list';
import { useStyles } from './styles';
import { colors } from '../../theme';
import { FormBase } from '../../types/inventory';

export const RenderSummarySection = (title: string, content: React.ReactNode) => {
  const styles = useStyles();

  return (
    <View style={styles.summarySection}>
      <Text style={styles.summarySectionTitle}>{title}</Text>
      {content}
    </View>
  );
};

export const seedsinitialFormData = {
  season: '',
  crop: '',
  variety: '',
  company: '',
  batchNumber: '',
  packingSize: '',
  pricePerUnit: '',
  quantity: '',
  purchasePrice: '',
  sellingPrice: '',
  totalCost: '0',
  estimatedprofit: '0',
  totalWeight: '0',
  manufacturingDate: new Date(),
  expiryDate: new Date(),
  date: new Date(),
  category: 'seeds',
};

export const fertilizersinitialFormData = {
  type: 'Water soluble',
  name: '',
  company: '',
  packingSize: '',
  state: 'Kg',
  purchasePrice: '',
  quantity: '',
  sellingPrice: '',
  totalCost: '0',
  estimatedprofit: '0',
  manufacturingDate: new Date(),
  expiryDate: new Date(),
  date: new Date(),
  category: 'fertilizers',
};

export const pesticidesinitialFormData = {
  type: 'Fungicide',
  name: '',
  company: '',
  packingSize: '',
  batchNumber: '',
  state: 'ml',
  purchasePrice: '',
  quantity: '',
  sellingPrice: '',
  totalCost: '0',
  estimatedprofit: '0',
  manufacturingDate: new Date(),
  expiryDate: new Date(),
  date: new Date(),
  category: 'pesticides',
};

export const SummaryRow = ({ label, value }: { label: string; value: string }) => {
  const styles = useStyles();

  return (
    <View style={styles.summaryRow}>
      <Text style={styles.summaryCell}>{label}</Text>
      <Text style={styles.summaryCell}>{value}</Text>
    </View>
  );
};

export const SelectField = ({
  label,
  onValueChange,
  data,
}: {
  label: string;
  onValueChange: (value: string) => void;
  data: string[];
}) => {
  const styles = useStyles();

  return (
    <SelectList
      boxStyles={styles.selectlistBoxStyles}
      dropdownTextStyles={{ fontSize: 14, color: 'white' }}
      dropdownStyles={styles.selectlistDropdown}
      setSelected={(value: string) => onValueChange(value)}
      search={false}
      data={data}
      placeholder={`Select ${label}`}
    />
  );
};

export const isSameDay = (date1: Date, date2: Date) => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

export const SubmitData = ({
  formData,
  handleSubmitData,
}: {
  formData: FormBase;
  handleSubmitData: () => void;
}) => {
  const styles = useStyles();

  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 8,
        backgroundColor: colors.darkInput,
      }}>
      <Text style={[styles.text, { color: 'white', fontSize: 20 }]}>
        ₹ {parseFloat(formData?.totalCost).toFixed(0)}
      </Text>
      <TouchableOpacity style={styles.button} onPress={handleSubmitData}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

export const monthYear = new Date().toLocaleDateString('en-GB', {
  month: 'short',
  year: 'numeric',
});
