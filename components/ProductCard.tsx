import React, { useState } from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import {CartItem, useUserData} from "../context/UserDataProvider";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ id, name, price, image }) => {
  const [quantity, setQuantity] = useState<number>(0);
    const { addToCart } = useUserData();
  const incrementQuantity = (): void => {
    setQuantity(prev => prev + 1);
  };

  const decrementQuantity = (): void => {
    setQuantity(prev => Math.max(0, prev - 1));
  };

    const handleAddToCart = () => {
        if (quantity > 0) {
            console.log(`Added ${quantity} ${name}(s) to cart`);
            addToCart({ id,productName:name, imageUrl:image ,price,quantity });
            setQuantity(0);
        }
    };

  return (
    <View style={styles.card}>
      <Image source={{ uri: image }} style={styles.image} resizeMode="cover" />
      
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={2}>{name}</Text>
        <Text style={styles.price}>{price.toFixed(2)} SAR</Text>
        
        <View style={styles.actionSection}>
          <View style={styles.counter}>
            <Pressable
              style={[styles.counterButton, quantity === 0 && styles.disabledButton]}
              onPress={decrementQuantity}
              disabled={quantity === 0}
            >
              <Text style={[styles.counterText, quantity === 0 && styles.disabledText]}>-</Text>
            </Pressable>
            
            <Text style={styles.quantity}>{quantity}</Text>
            
            <Pressable
              style={styles.counterButton}
              onPress={incrementQuantity}
            >
              <Text style={styles.counterText}>+</Text>
            </Pressable>
          </View>
          
          {quantity > 0 && (
            <Pressable style={styles.addButton} onPress={handleAddToCart}>
              <Text style={styles.addButtonText}>Add to Cart</Text>
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 170,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    marginHorizontal: 5,
    marginVertical: 8,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  image: {
    width: '100%',
    height: 120,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 6,
    lineHeight: 20,
  },
  price: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ff7f50',
    textAlign: 'center',
    marginBottom: 12,
  },
  actionSection: {
    alignItems: 'center',
  },
  counter: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginBottom: 10,
  },
  counterButton: {
    backgroundColor: '#ff7f50',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#cccccc',
  },
  counterText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledText: {
    color: '#999',
  },
  quantity: {
    marginHorizontal: 15,
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    minWidth: 20,
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: '#ff7f50',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 16,
    shadowColor: '#ff7f50',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default ProductCard;