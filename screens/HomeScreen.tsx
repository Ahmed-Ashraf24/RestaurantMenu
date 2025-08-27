import React from 'react';
import { FlatList, StyleSheet, SafeAreaView, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import ProductCard from '../components/ProductCard';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
}

const products: Product[] = [
  {
    id: '1',
    name: 'Double Whopper',
    price: 29.57,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxXwYBrFVpP3OGlJQpmHqfZmqu5j5iAD53gg&s',
  },
  {
    id: '2',
    name: 'Steakhouse XL',
    price: 35.65,
    image: 'https://www.foodandwine.com/thmb/DI29Houjc_ccAtFKly0BbVsusHc=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/crispy-comte-cheesburgers-FT-RECIPE0921-6166c6552b7148e8a8561f7765ddf20b.jpg',
  },
  {
    id: '3',
    name: 'Classic Beef Burger',
    price: 25.50,
    image: 'https://www.foodandwine.com/thmb/DI29Houjc_ccAtFKly0BbVsusHc=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/crispy-comte-cheesburgers-FT-RECIPE0921-6166c6552b7148e8a8561f7765ddf20b.jpg',
  },
  {
    id: '4',
    name: 'Premium Deluxe',
    price: 42.75,
    image: 'https://www.foodandwine.com/thmb/DI29Houjc_ccAtFKly0BbVsusHc=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/crispy-comte-cheesburgers-FT-RECIPE0921-6166c6552b7148e8a8561f7765ddf20b.jpg',
  },
  {
    id: '5',
    name: 'BBQ Special',
    price: 38.90,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxXwYBrFVpP3OGlJQpmHqfZmqu5j5iAD53gg&s',
  },
  {
    id: '6',
    name: 'Chicken Supreme',
    price: 31.25,
    image: 'https://www.foodandwine.com/thmb/DI29Houjc_ccAtFKly0BbVsusHc=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/crispy-comte-cheesburgers-FT-RECIPE0921-6166c6552b7148e8a8561f7765ddf20b.jpg',
  },
];

const HomeScreen: React.FC = () => {
  const renderProduct = ({ item }: { item: Product }) => (
    <ProductCard 
      id={item.id}
      name={item.name} 
      price={item.price} 
      image={item.image} 
    />
  );

  return (
    <LinearGradient
      colors={["#4c669f", "#3b5998", "#192f6a"]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Our Menu 🍔</Text>
          <Text style={styles.headerSubtitle}>Delicious food delivered to you</Text>
        </View>
        
        <FlatList
          data={products}
          renderItem={renderProduct}
          keyExtractor={(item: Product) => item.id}
          numColumns={2}
          contentContainerStyle={styles.listContainer}
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}
        />
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#ddd',
    textAlign: 'center',
  },
  listContainer: {
    padding: 15,
    paddingTop: 10,
  },
  row: {
    justifyContent: 'space-around',
    marginBottom: 10,
  },
});

export default HomeScreen;