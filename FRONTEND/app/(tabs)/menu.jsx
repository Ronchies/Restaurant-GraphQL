import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useState } from 'react';
import globalStyles from '../../assets/styles/globalStyles'; // Using the same global styles

export default function Menu() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  const categories = ['All', 'Pasta', 'Pizza', 'Salad', 'Dessert'];
  
  const menuItems = [
    {
      name: 'Pasta Carbonara',
      category: 'Pasta',
      prepTime: 15,
      price: 12.99,
      available: true,
    },
    {
      name: 'Pasta Carbonara',
      category: 'Pasta',
      prepTime: 15,
      price: 12.99,
      available: true,
    },
    {
      name: 'Pasta Carbonara',
      category: 'Pasta',
      prepTime: 15,
      price: 12.99,
      available: true,
    },
    {
      name: 'Pasta Carbonara',
      category: 'Pasta',
      prepTime: 15,
      price: 12.99,
      available: true,
    },
    {
      name: 'Pasta Carbonara',
      category: 'Pasta',
      prepTime: 15,
      price: 12.99,
      available: true,
    }
  ];

  return (
    <ScrollView style={globalStyles.layout.scrollView}>
      <View style={globalStyles.layout.container}>
        {/* Header with Menu and Profile */}
        <View style={globalStyles.layout.header}>
          <View style={globalStyles.buttons.overview}>
            <Text style={globalStyles.buttons.overviewText}>Menu</Text>
          </View>
          <View style={globalStyles.layout.headerRight}>
            <View style={globalStyles.icons.bell}>
              <FontAwesome5 name="bell" size={24} color="black" />
            </View>
            <View style={globalStyles.icons.profile}>
              <Text style={globalStyles.text.profileText}>👤</Text>
            </View>
          </View>
        </View>

        {/* Category Filter */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.categoryContainer}
        >
          {categories.map((category, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.categoryButton,
                selectedCategory === category ? styles.selectedCategoryButton : {},
                index === 0 && { marginLeft: 0 }
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text 
                style={[
                  styles.categoryText,
                  selectedCategory === category ? styles.selectedCategoryText : {}
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Menu Items */}
        <View style={styles.menuList}>
          {menuItems.map((item, index) => (
            <View key={index} style={styles.menuItemCard}>
              <View style={styles.menuItemContent}>
                <View style={styles.menuItemInfo}>
                  <Text style={styles.menuItemName}>{item.name}</Text>
                  <Text style={styles.menuItemCategory}>{item.category} • {item.prepTime} min</Text>
                  <Text style={styles.menuItemPrice}>${item.price.toFixed(2)}</Text>
                </View>
                
                <View style={styles.menuItemRight}>
                  <View style={styles.availabilityBadge}>
                    <Text style={styles.availabilityText}>
                      {item.available ? 'Available' : 'Sold Out'}
                    </Text>
                  </View>
                  
                  <View style={styles.menuItemActions}>
                    <TouchableOpacity style={styles.actionButton}>
                      <FontAwesome5 name="clipboard" size={20} color="#007AFF" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionButton}>
                      <FontAwesome5 name="trash" size={20} color="#FF3B30" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  categoryContainer: {
    flexGrow: 0,
    marginBottom: 15,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
  },
  selectedCategoryButton: {
    backgroundColor: '#E17055',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
  },
  selectedCategoryText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  menuList: {
    width: '100%',
  },
  menuItemCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  menuItemContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  menuItemInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  menuItemName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  menuItemCategory: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 6,
  },
  menuItemPrice: {
    fontSize: 16,
    fontWeight: '600',
  },
  menuItemRight: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingLeft: 10,
  },
  availabilityBadge: {
    backgroundColor: '#E8F5E9',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 10,
  },
  availabilityText: {
    color: '#2E7D32',
    fontSize: 12,
    fontWeight: '500',
  },
  menuItemActions: {
    flexDirection: 'row',
  },
  actionButton: {
    marginLeft: 15,
  },
});