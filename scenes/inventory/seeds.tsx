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
import { SelectField, seedsinitialFormData, SubmitData } from './utils';
import { colors } from '../../theme';
import ScreenTemplate from '../../components/ScreenTemplate';
import { UserDataContext } from '../../context/UserDataContext';
import { ColorSchemeContext } from '../../context/ColorSchemeContext';
import { showToast } from '../../utils/ShowToast';
import { AddStock } from '../../utils/addstock';
import { SummaryCard } from '../../components/expenseCard';
import { MaterialIcons } from '@expo/vector-icons';
import Section from '../../components/inventorysection';
import { useStyles } from './styles';
import { useSummaryData } from './useSummaryData';
import { SeedsSummary } from './summary';

export default function SeedsView() {
  const { userData } = useContext(UserDataContext);
  const { scheme } = useContext(ColorSchemeContext);
  const isDark = scheme === 'dark';
  const styles = useStyles(isDark);

  const [refreshing, setRefreshing] = useState(false);
  const [formData, setFormData] = useState(seedsinitialFormData);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showManufacturingDatePicker, setShowManufacturingDatePicker] = useState(false);
  const [showExpiryDatePicker, setShowExpiryDatePicker] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const monthYear = new Date().toLocaleDateString('en-GB', {
    month: 'short',
    year: 'numeric',
  });
  const { summaryData } = useSummaryData(monthYear, 'seeds', refreshTrigger);
  const seedsData = userData.inventory.seeds;

  const onRefresh = () => {
    setRefreshing(true);
    setFormData(seedsinitialFormData);
    setRefreshTrigger((prev) => prev + 1);

    setTimeout(() => {
      setRefreshing(false);
    }, 200);
  };

  const handleDateChange = (selectedDate, key) => {
    if (selectedDate) {
      setFormData({ ...formData, [key]: selectedDate });
    }

    // Reset the corresponding date picker state based on 'key'
    switch (key) {
      case 'date':
        setShowDatePicker(false);
        break;
      case 'manufacturingDate':
        setShowManufacturingDatePicker(false);
        break;
      case 'expiryDate':
        setShowExpiryDatePicker(false);
        break;
      default:
        break;
    }
  };

  const renderDatePicker = (value, key) => {
    const isDatePickerVisible =
      showDatePicker ||
      (key === 'manufacturingDate' && showManufacturingDatePicker) ||
      (key === 'expiryDate' && showExpiryDatePicker);

    if (Platform.OS === 'ios' || isDatePickerVisible) {
      return (
        <DateTimePicker
          value={value}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => handleDateChange(selectedDate || value, key)}
        />
      );
    }
    return null;
  };

  const handleInputChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
  };

  const recalculate = (data) => {
    const purchasePrice = parseFloat(data.purchasePrice) || 0;
    const quantity = parseFloat(data.quantity) || 0;
    const packingSize = parseFloat(data.packingSize) || 0;
    const sellingPrice = parseFloat(data.sellingPrice) || 0;

    let totalCost = 0;
    let estimatedProfit = 0;
    let pricePerUnit = 0;

    if (purchasePrice && packingSize) {
      pricePerUnit = purchasePrice * packingSize;
    }

    if (pricePerUnit && quantity) {
      totalCost = pricePerUnit * quantity;
    } else if (purchasePrice && packingSize && quantity) {
      totalCost = purchasePrice * packingSize * quantity;
    }

    if (purchasePrice && sellingPrice) {
      estimatedProfit = packingSize * quantity * (sellingPrice - purchasePrice);
    }

    return {
      ...data,
      pricePerUnit: pricePerUnit.toFixed(0),
      totalCost: totalCost.toFixed(2),
      estimatedprofit: estimatedProfit.toFixed(2),
      totalWeight: packingSize * quantity,
    };
  };

  const handlePriceChange = (key, value) => {
    const updatedData = { ...formData, [key]: value };
    setFormData(recalculate(updatedData));
  };

  const handleSubmitData = () => {
    if (
      !formData.season ||
      !formData.crop ||
      !formData.variety ||
      !formData.company ||
      !formData.batchNumber ||
      !formData.packingSize ||
      !formData.quantity ||
      !formData.purchasePrice ||
      !formData.sellingPrice
    ) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    AddStock(formData, 'seeds', userData, formData.date)
      .then(() => {
        showToast({
          title: `${formData.crop} Stock added of ${formData.totalWeight} Kgs.`,
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
        resetFormData();
      });
  };

  const resetFormData = () => {
    setFormData((prevData) => ({
      ...prevData,
      batchNumber: '',
      packingSize: '',
      quantity: '',
      purchasePrice: '',
      sellingPrice: '',
      date: new Date(),
      manufacturingDate: new Date(),
      expiryDate: new Date(),
      pricePerUnit: '',
      totalCost: 0,
      estimatedprofit: 0,
      totalWeight: 0,
    }));
  };

  const isSameDay = (date1, date2) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
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
              expense={summaryData.totalCost}
              profit={summaryData.totalEstimatedProfit}
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
            </TouchableOpacity>
            {showDatePicker && renderDatePicker(formData.date, 'date')}

            {/* About crop */}
            <Section>
              <SelectField
                label="Season"
                selectedValue={formData.season}
                onValueChange={(value) => handleInputChange('season', value)}
                data={['Kharif', 'Rabi', 'Summer']}
              />

              <SelectField
                label="Crop"
                selectedValue={formData.crop}
                onValueChange={(value) => handleInputChange('crop', value)}
                data={seedsData.crops || ['Default']}
              />

              <SelectField
                label="Variety"
                selectedValue={formData.variety}
                onValueChange={(value) => handleInputChange('variety', value)}
                data={seedsData.variety || ['Default']}
              />

              <SelectField
                label="Company"
                selectedValue={formData.company}
                onValueChange={(value) => handleInputChange('company', value)}
                data={['farmer', ...(seedsData.company || ['Default'])]}
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
              <TextInput
                style={styles.input}
                placeholder="Packing Size (Kg)"
                value={formData.packingSize}
                onChangeText={(text) => handlePriceChange('packingSize', text)}
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
                Packing Size in Kgs
              </Text>

              <TextInput
                style={styles.input}
                placeholder="Number of bags"
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

              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  width: 300,
                  justifyContent: 'space-evenly',
                }}>
                <View style={styles.inlineInput}>
                  <TextInput
                    style={{
                      height: 46,
                      width: '100%',
                      paddingLeft: 3,
                      borderColor: '#BABABA',
                      borderRadius: 10,
                      backgroundColor: '#F2F3F4',
                      borderWidth: 1,
                    }}
                    placeholder="₹ Price per unit/bag"
                    value={formData.pricePerUnit}
                    onChangeText={(text) => handlePriceChange('pricePerUnit', text)}
                    keyboardType="numeric"
                    editable={formData.quantity > 0 && formData.packingSize > 0}
                  />
                  <Text style={[{ color: 'white' }]}>Price per unit/bag</Text>
                </View>

                <View style={styles.inlineInput}>
                  <TextInput
                    style={{
                      height: 46,
                      width: '100%',
                      paddingLeft: 3,
                      borderColor: '#BABABA',
                      borderRadius: 10,
                      backgroundColor: '#F2F3F4',
                      borderWidth: 1,
                    }}
                    placeholder="₹ Price per Kg"
                    value={formData.purchasePrice}
                    onChangeText={(text) => handlePriceChange('purchasePrice', text)}
                    keyboardType="numeric"
                    editable={formData.quantity > 0 && formData.packingSize > 0}
                  />
                  <Text style={[{ color: 'white' }]}>Price per Kg</Text>
                </View>
              </View>
            </Section>

            {/* Price */}
            <Section>
              <TextInput
                style={styles.input}
                placeholder="Estimated selling price per Kg"
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

            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingTop: 10,
                paddingBottom: 20,
                width: '100%',
                paddingHorizontal: 20,
                borderTopWidth: 1,
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
        <SeedsSummary formData={formData} />
      </ScrollView>

      <SubmitData formData={formData} handleSubmitData={handleSubmitData} />
    </ScreenTemplate>
  );
}
