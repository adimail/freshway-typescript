import React, { useState, useContext, useEffect } from 'react';
import { Text, View, TextInput, StyleSheet, Button, ScrollView } from 'react-native';
import ScreenTemplate from '../../components/ScreenTemplate';
import { useFocusEffect } from '@react-navigation/native';
import { HomeTitleContext } from '../../context/HomeTitleContext';
import { UserDataContext } from '../../context/UserDataContext';
import { colors } from '../../theme';
import CustomSwitch from '../../components/toggleSwitch';
import { firestore } from '../../firebase/config';
import { doc, updateDoc, getDoc, DocumentReference } from 'firebase/firestore';
import { showToast } from '../../utils/ShowToast';
import IconButton from '../../components/IconButton';

interface InventoryCategory {
  name: string[];
  company: string[];
  crops?: string[];
  variety?: string[];
}

interface InventoryCategories {
  seeds: InventoryCategory;
  fertilizers: InventoryCategory;
  pesticides: InventoryCategory;
}

const Post: React.FC = () => {
  const { setTitle } = useContext(HomeTitleContext);
  const { userData } = useContext(UserDataContext)!;
  const isDark = true;
  const [type, setType] = useState<string>('Sell');
  const [newCategory, setNewCategory] = useState<string>('');
  const [parentCategory, setParentCategory] = useState<string>('Shop');
  const [subCategories, setSubCategories] = useState<string[]>(['Sell', 'Credit']);

  useFocusEffect(() => {
    setTitle('Custom Categories');
  });

  const [sellCategories, setSellCategories] = useState<string[]>([]);
  const [creditCategories, setCreditCategories] = useState<string[]>([]);
  const [inventoryCategories, setInventoryCategories] = useState<InventoryCategories>({
    seeds: { name: [], company: [], crops: [], variety: [] },
    fertilizers: { name: [], company: [] },
    pesticides: { name: [], company: [] },
  });

  // Fetch categories from Firestore
  useEffect(() => {
    const fetchCategories = async () => {
      if (userData) {
        try {
          const userDocRef: DocumentReference = doc(firestore, 'users', userData.id);
          const docSnap = await getDoc(userDocRef);
          const userCategories = docSnap.data();

          if (userCategories) {
            setSellCategories(userCategories.Sell || []);
            setCreditCategories(userCategories.Credit || []);
            setInventoryCategories(
              userCategories.inventory || {
                seeds: { name: [], company: [], crops: [], variety: [] },
                fertilizers: { name: [], company: [] },
                pesticides: { name: [], company: [] },
              }
            );
          }
        } catch (error) {
          showToast({
            title: 'Error',
            body: 'Failed to fetch categories. Please try again.',
          });
        }
      }
    };

    fetchCategories();
  }, [userData, isDark]);

  // Update function to set subcategories based on parent category
  const onSelectParentCategory = (category: string) => {
    setParentCategory(category);

    // Set appropriate subcategories based on selected parent category
    let newSubCategories: string[] = [];
    switch (category) {
      case 'Shop':
        newSubCategories = ['Sell', 'Credit'];
        break;
      case 'Seeds':
        newSubCategories = ['company', 'crops', 'variety'];
        break;
      case 'Fertilizers':
        newSubCategories = ['name', 'company'];
        break;
      case 'Pesticides':
        newSubCategories = ['name', 'company'];
        break;
      default:
        newSubCategories = [];
    }
    setSubCategories(newSubCategories);
    setType(newSubCategories[0] || '');
  };

  // Function to add a category
  const addCategory = async () => {
    if (newCategory) {
      let updatedCategories: string[] = [];
      let updatedInventory: InventoryCategories = { ...inventoryCategories };

      if (type === 'Sell') {
        updatedCategories = [...sellCategories];
      } else if (type === 'Credit') {
        updatedCategories = [...creditCategories];
      } else {
        updatedCategories = [
          ...(inventoryCategories[parentCategory.toLowerCase() as keyof InventoryCategories][
            type.toLowerCase() as keyof InventoryCategory
          ] || ['']),
        ];
      }

      if (updatedCategories.length >= 9) {
        showToast({
          title: 'Stack Overflow',
          body: 'You can add up to 9 max categories',
        });
        return;
      }

      updatedCategories.push(newCategory);

      try {
        const userDocRef: DocumentReference = doc(firestore, 'users', userData.id);

        if (type === 'Sell' || type === 'Credit') {
          await updateDoc(userDocRef, {
            [type.toLowerCase()]: updatedCategories,
          });
        } else {
          updatedInventory = {
            ...inventoryCategories,
            [parentCategory.toLowerCase()]: {
              ...inventoryCategories[parentCategory.toLowerCase() as keyof InventoryCategories],
              [type.toLowerCase()]: updatedCategories,
            },
          };

          await updateDoc(userDocRef, {
            inventory: updatedInventory,
          });

          setInventoryCategories(updatedInventory);
        }

        if (type === 'Sell') {
          setSellCategories(updatedCategories);
        } else if (type === 'Credit') {
          setCreditCategories(updatedCategories);
        }

        showToast({
          title: 'Category Added',
          body: newCategory,
        });

        setNewCategory('');
      } catch (error) {
        showToast({
          title: 'Error',
          body: 'Failed to add category. Please try again.',
        });
      }
    }
  };

  // Function to remove a category
  const removeCategory = async (category: string) => {
    let updatedCategories: string[] = [];
    let updatedInventory: InventoryCategories = { ...inventoryCategories };

    if (type === 'Sell') {
      updatedCategories = [...sellCategories];
    } else if (type === 'Credit') {
      updatedCategories = [...creditCategories];
    } else {
      updatedCategories = [
        ...(inventoryCategories[parentCategory.toLowerCase() as keyof InventoryCategories][
          type.toLowerCase() as keyof InventoryCategory
        ] || ['']),
      ];
    }

    if (updatedCategories.length === 1) {
      alert('You must have at least one category in the list.');
      return;
    }

    const index = updatedCategories.indexOf(category);
    if (index !== -1) {
      updatedCategories.splice(index, 1);

      try {
        const userDocRef: DocumentReference = doc(firestore, 'users', userData.id);

        if (type === 'Sell' || type === 'Credit') {
          await updateDoc(userDocRef, {
            [type.toLowerCase()]: updatedCategories,
          });
        } else {
          updatedInventory = {
            ...inventoryCategories,
            [parentCategory.toLowerCase()]: {
              ...inventoryCategories[parentCategory.toLowerCase() as keyof InventoryCategories],
              [type.toLowerCase()]: updatedCategories,
            },
          };

          await updateDoc(userDocRef, {
            inventory: updatedInventory,
          });

          setInventoryCategories(updatedInventory);
        }

        if (type === 'Sell') {
          setSellCategories(updatedCategories);
        } else if (type === 'Credit') {
          setCreditCategories(updatedCategories);
        }

        showToast({
          title: 'Category Removed',
          body: category,
        });
      } catch (error) {
        showToast({
          title: 'Error',
          body: 'Failed to remove category. Please try again.',
        });
      }
    }
  };

  const onSelectSwitch = (value: string) => {
    setType(value);
  };

  const renderCategories = () => {
    let categories: string[] = [];
    if (type === 'Sell') {
      categories = sellCategories;
    } else if (type === 'Credit') {
      categories = creditCategories;
    } else {
      categories = inventoryCategories[parentCategory.toLowerCase() as keyof InventoryCategories][
        type.toLowerCase() as keyof InventoryCategory
      ] || [''];
    }

    return (
      <View style={styles.cat}>
        {categories.map((item, index) => (
          <View style={styles.categoryItem} key={index}>
            <Text style={{ color: isDark ? 'white' : 'black' }}>{item}</Text>
            <IconButton
              icon="trash"
              color={colors.primary}
              size={20}
              onPress={() => removeCategory(item)}
            />
          </View>
        ))}
      </View>
    );
  };

  return (
    <ScreenTemplate>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <CustomSwitch
            roundCorner
            options={['Shop', 'Seeds', 'Fertilizers', 'Pesticides']}
            onSelectSwitch={onSelectParentCategory}
            selectionColor="#1C2833"
            height={50}
            borderRadius={100}
          />

          <View style={[styles.separator]} />

          <CustomSwitch
            roundCorner
            options={subCategories}
            onSelectSwitch={onSelectSwitch}
            selectionColor={colors.blueLight}
            height={36}
            borderRadius={100}
          />

          <View
            style={[styles.separator, { backgroundColor: colors.blueLight, marginVertical: 30 }]}
          />

          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, { color: isDark ? 'white' : 'black' }]}
              value={newCategory}
              onChangeText={(text) => {
                setNewCategory(text);
              }}
              placeholder="Enter new category"
              placeholderTextColor={isDark ? 'white' : 'black'}
            />

            <Button title="Add New Category" onPress={addCategory} color={colors.primary} />
          </View>

          {renderCategories()}
        </View>
      </ScrollView>
    </ScreenTemplate>
  );
};

const styles = StyleSheet.create({
  lightContent: {
    backgroundColor: '#fff',
  },
  darkContent: {
    backgroundColor: '#34495E',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 20,
    marginTop: 10,
    marginBottom: 5,
    textAlign: 'center',
  },
  inputContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    alignItems: 'center',
    marginBottom: 30,
    gap: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 50,
    paddingHorizontal: 15,
    color: colors.primaryText,
    width: '80%',
    height: 45,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#7676768f',
    borderRadius: 15,
    padding: 10,
    marginVertical: 8,
    width: '80%',
    height: 60,
  },
  cat: {
    width: '100%',
    maxWidth: 600,
  },
  separator: {
    marginVertical: 5,
    height: 1,
    width: '80%',
    alignSelf: 'center',
  },
});

export default Post;
