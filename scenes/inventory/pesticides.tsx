import React, { useState, useContext } from 'react';
import {
  Text,
  View,
  ScrollView,
  TextInput,
  Alert,
  RefreshControl,
  TouchableOpacity,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { SelectField, isSameDay, pesticidesinitialFormData, SubmitData } from './utils';
import { colors } from '../../theme';
import ScreenTemplate from '../../components/ScreenTemplate';
import { UserDataContext } from '../../context/UserDataContext';

import { showToast } from '../../utils/ShowToast';
import { AddStock } from '../../utils/addstock';
import { SummaryCard } from '../../components/expenseCard';
import { MaterialIcons } from '@expo/vector-icons';
import Section from '../../components/inventorysection';
import { useStyles } from './styles';
import { useSummaryData } from './useSummaryData';
import CustomSwitch from '../../components/toggleSwitch';
import { PesticidesSummary } from './summary';

export default function PesticidesView() {
  const { userData } = useContext(UserDataContext)!;

  const isDark = true;
  const styles = useStyles(isDark);

  const [refreshing, setRefreshing] = useState(false);
  const [formData, setFormData] = useState(pesticidesinitialFormData);
  // eslint-disable-next-line no-unused-vars
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showManufacturingDatePicker, setShowManufacturingDatePicker] = useState(false);
  const [showExpiryDatePicker, setShowExpiryDatePicker] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const monthYear = new Date().toLocaleDateString('en-GB', {
    month: 'short',
    year: 'numeric',
  });
  const { summaryData } = useSummaryData(monthYear, 'pesticides', refreshTrigger);
  const pesticidesData = userData.inventory.pesticides;

  const onRefresh = () => {
    setRefreshing(true);
    setFormData(pesticidesinitialFormData);
    setRefreshTrigger((prev) => prev + 1);

    setTimeout(() => {
      setRefreshing(false);
    }, 200);
  };

  const handleDateChange = (selectedDate, key) => {
    if (selectedDate) {
      setFormData({ ...formData, [key]: selectedDate });
      if (key === 'date') {
        setShowDatePicker(false);
      } else if (key === 'manufacturingDate') {
        setShowManufacturingDatePicker(false);
      } else if (key === 'expiryDate') {
        setShowExpiryDatePicker(false);
      }
    } else if (key === 'date') {
      setShowDatePicker(false);
    } else if (key === 'manufacturingDate') {
      setShowManufacturingDatePicker(false);
    } else if (key === 'expiryDate') {
      setShowExpiryDatePicker(false);
    }
  };

  const renderDatePicker = (value, key) => {
    if (Platform.OS === 'ios') {
      return (
        <DateTimePicker
          value={value}
          mode="date"
          display="spinner"
          onChange={(event, selectedDate) => handleDateChange(selectedDate || value, key)}
        />
      );
    }
    return showDatePicker ||
      (key === 'manufacturingDate' && showManufacturingDatePicker) ||
      (key === 'expiryDate' && showExpiryDatePicker) ? (
      <DateTimePicker
        value={value}
        mode="date"
        display="default"
        onChange={(event, selectedDate) => handleDateChange(selectedDate || value, key)}
      />
    ) : null;
  };

  const handleInputChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
  };

  const recalculate = (data) => {
    const purchasePrice = parseFloat(data.purchasePrice) || 0;
    const quantity = parseFloat(data.quantity) || 0;
    const sellingPrice = parseFloat(data.sellingPrice) || 0;

    let totalCost = 0;
    let estimatedProfit = 0;

    if (purchasePrice && quantity) {
      totalCost = purchasePrice * quantity;
      if (sellingPrice) {
        estimatedProfit = (sellingPrice - purchasePrice) * quantity;
      }
    }

    return {
      ...data,
      totalCost: totalCost.toFixed(0),
      estimatedprofit: estimatedProfit.toFixed(0),
    };
  };

  const handlePriceChange = (key, value) => {
    const updatedData = { ...formData, [key]: value };
    setFormData(recalculate(updatedData));
  };

  const handleSubmitData = () => {
    if (
      !formData.name ||
      !formData.company ||
      !formData.batchNumber ||
      !formData.packingSize ||
      !formData.quantity ||
      !formData.purchasePrice ||
      !formData.sellingPrice
    ) {
      Alert.alert('Incomplete form', 'Please fill in all fields');
      return;
    }

    AddStock(formData, 'pesticides', userData, formData.date)
      .then(() => {
        showToast({
          title: `${formData.name} Stock added `,
          body: `Total Cost ${formData.totalCost}`,
          isDark,
        });
        setRefreshTrigger((prev) => prev + 1); // Trigger summary data refresh
      })
      .catch((error) => {
        console.error('Error adding document: ', error);
        Alert.alert('Error', 'Failed to add log. Please try again.');
      })
      .finally(() => {
        setFormData(pesticidesinitialFormData);
      });
  };

  return (
    <ScreenTemplate>
      <ScrollView
        style={[styles.main]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />
        }>
        <View style={[styles.top]}>
          <View style={styles.container}>
            <SummaryCard
              expense={summaryData.totalCost.toString()}
              profit={summaryData.totalEstimatedProfit.toString()}
            />
          </View>

          <View
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 25,
              paddingHorizontal: 20,
            }}>
            <TouchableOpacity
              style={{
                alignItems: 'center',
                display: 'flex',
                flexDirection: 'row',
              }}
              onPress={() => {
                setShowDatePicker(true);
              }}>
              <MaterialIcons name="date-range" size={30} color={colors.white} />
              <Text style={{ color: 'white' }}>
                Bought:{' '}
                {isSameDay(formData.date, new Date())
                  ? 'Today'
                  : formData.date.toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
              </Text>
              {showDatePicker && renderDatePicker(formData.date, 'date')}
            </TouchableOpacity>

            {/* About crop */}
            <Section>
              <CustomSwitch
                roundCorner
                options={['Fungicide', 'Insecticide', 'Weedicide']}
                onSelectSwitch={(value) => {
                  handleInputChange('type', value);
                }}
                height={46}
                selectionColor={colors.darkPurple}
              />
              <SelectField
                label="Pesticide name"
                selectedValue={formData.name}
                onValueChange={(value) => handleInputChange('name', value)}
                data={pesticidesData.name || ['Default']}
              />

              <SelectField
                label="Company"
                selectedValue={formData.company}
                onValueChange={(value) => handleInputChange('company', value)}
                data={pesticidesData.company || ['Default']}
              />

              <TextInput
                style={styles.input}
                placeholder="Batch Number"
                value={formData.batchNumber}
                onChangeText={(text) => handleInputChange('batchNumber', text)}
              />
              <Text
                style={[
                  {
                    color: 'white',
                    textAlign: 'left',
                    width: 300,
                    paddingLeft: 7,
                  },
                ]}>
                Batch Number
              </Text>
            </Section>

            <View style={[styles.separator]} />

            {/* Package details */}
            <Section>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  width: 300,
                  justifyContent: 'space-between',
                  marginBottom: 10,
                }}>
                <View style={styles.inlineInput}>
                  <TextInput
                    style={{
                      height: 46,
                      width: '100%',
                      borderColor: '#BABABA',
                      borderRadius: 10,
                      backgroundColor: '#F2F3F4',
                      borderWidth: 1,
                      paddingLeft: 10,
                    }}
                    placeholder="Packing Size"
                    value={formData.packingSize}
                    onChangeText={(text) => handlePriceChange('packingSize', text)}
                    keyboardType="numeric"
                  />
                </View>

                <View style={styles.inlineInput}>
                  <CustomSwitch
                    roundCorner
                    options={['Kg', 'ml']}
                    onSelectSwitch={(value) => {
                      handleInputChange('state', value);
                    }}
                    height={46}
                    selectionColor="#1C2833"
                  />
                </View>
              </View>

              <TextInput
                style={styles.input}
                placeholder="How many bought?"
                value={formData.quantity}
                onChangeText={(text) => handlePriceChange('quantity', text)}
                keyboardType="numeric"
              />
              <Text
                style={[
                  {
                    color: 'white',
                    textAlign: 'left',
                    width: 300,
                    paddingLeft: 7,
                  },
                ]}>
                Quantity Nos.
              </Text>

              <TextInput
                style={styles.input}
                placeholder="₹ Price per unit"
                value={formData.purchasePrice}
                onChangeText={(text) => handlePriceChange('purchasePrice', text)}
                keyboardType="numeric"
              />
              <Text
                style={[
                  {
                    color: 'white',
                    textAlign: 'left',
                    width: 300,
                    paddingLeft: 7,
                  },
                ]}>
                ₹ Price per unit
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Estimated selling price per unit"
                value={formData.sellingPrice}
                onChangeText={(text) => handlePriceChange('sellingPrice', text)}
                keyboardType="numeric"
              />
              <Text
                style={[
                  {
                    color: 'white',
                    textAlign: 'left',
                    width: 300,
                    paddingLeft: 7,
                  },
                ]}>
                Selling Price per Kg
              </Text>
            </Section>

            <View style={[styles.separator]} />

            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingBottom: 20,
                width: '100%',
                paddingHorizontal: 20,
              }}>
              <View style={{ width: '40%' }}>
                <Text style={styles.datePickerButton}>Manufacturing Date</Text>
                <TouchableOpacity
                  onPress={() => setShowManufacturingDatePicker(true)}
                  style={styles.dateButton}>
                  <Text style={styles.datePickerText}>
                    {formData.manufacturingDate.toLocaleDateString('en-GB', {
                      month: 'short',
                      year: 'numeric',
                    })}
                  </Text>
                </TouchableOpacity>
                {showManufacturingDatePicker &&
                  renderDatePicker(formData.manufacturingDate, 'manufacturingDate')}
              </View>

              <View style={{ width: '40%' }}>
                <Text style={styles.title}>Expiry Date</Text>
                <TouchableOpacity
                  onPress={() => setShowExpiryDatePicker(true)}
                  style={styles.dateButton}>
                  <Text style={styles.title}>
                    {formData.expiryDate.toLocaleDateString('en-GB', {
                      month: 'short',
                      year: 'numeric',
                    })}
                  </Text>
                </TouchableOpacity>
                {showExpiryDatePicker && renderDatePicker(formData.expiryDate, 'expiryDate')}
              </View>
            </View>
          </View>
        </View>
        {/* Order summary */}
        <PesticidesSummary formData={formData} />
      </ScrollView>

      <SubmitData formData={formData} handleSubmitData={handleSubmitData} />
    </ScreenTemplate>
  );
}
