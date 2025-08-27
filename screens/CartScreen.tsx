import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    Image,
    Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { CartItem, useUserData } from "../context/UserDataProvider";

interface CartItemWithSelection extends CartItem {
}

const CartScreen: React.FC<any> = ({ navigation }) => {
    const  cart  = useUserData().cart; // ✅ provider cart
    const [localCart, setLocalCart] = useState<CartItemWithSelection[]>([]);
    const { placeOrder } = useUserData();

    // Keep localCart in sync when provider cart changes
    useEffect(() => {
        setLocalCart(cart.map(item => ({ ...item, selected : item.selected ?? false })));
    }, [cart]);

    const toggleItemSelection = (id: string) => {
        setLocalCart(prev =>
            prev.map(item =>
                item.id === id ? { ...item, selected: !item.selected } : item
            )
        );
    };

    const updateQuantity = (id: string, increment: boolean) => {
        setLocalCart(prev =>
            prev.map(item =>
                item.id === id
                    ? {
                        ...item,
                        quantity: increment
                            ? item.quantity + 1
                            : Math.max(1, item.quantity - 1),
                    }
                    : item
            )
        );
    };

    const removeItem = (id: string) => {
        Alert.alert("Remove Item", "Are you sure you want to remove this item?", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Remove",
                style: "destructive",
                onPress: () => {
                    setLocalCart(prev => prev.filter(item => item.id !== id));
                    // ⚠️ if you want to remove from Firestore too, call refreshData() or add a removeFromCart in provider
                },
            },
        ]);
    };

    const getSelectedItems = () => localCart.filter(item => item.selected);

    const calculateTotal = () =>
        getSelectedItems().reduce(
            (total, item) => total + item.price * item.quantity,
            0
        );

    const handleOrder = () => {
        const selectedItems = getSelectedItems();
        if (selectedItems.length === 0) {
            Alert.alert("No Items Selected", "Please select at least one item to order.");
            return;
        }

        const total = calculateTotal();
        Alert.alert("Confirm Order", `Order ${selectedItems.length} items for $${total.toFixed(2)}?`, [
            { text: "Cancel", style: "cancel" },
            {
                text: "Order Now",
                onPress: () => {
                    selectedItems.forEach((element)=>{
                        placeOrder({...element,date: new Date()})
                    })
                    console.log("Ordering items:", selectedItems);
                    Alert.alert("Order Placed!", "Your order has been placed successfully.");
                },
            },
        ]);
    };

    const selectAllItems = () => {
        const allSelected = localCart.every(item => item.selected);
        setLocalCart(prev =>
            prev.map(item => ({
                ...item,
                selected: !allSelected,
            }))
        );
    };

    const renderCartItem = (item: CartItemWithSelection) => (
        <View key={item.id} style={styles.cartItemContainer}>
            <TouchableOpacity
                style={styles.cartItem}
                onPress={() => toggleItemSelection(item.id || "")}
                activeOpacity={0.7}
            >
                {/* Selection Indicator */}
                <View style={styles.selectionContainer}>
                    <View style={[styles.checkbox, item.selected && styles.checkboxSelected]}>
                        {item.selected && <Text style={styles.checkmark}>✓</Text>}
                    </View>
                </View>

                <Image source={{ uri: item.imageUrl }} style={styles.itemImage} />

                <View style={styles.itemDetails}>
                    <Text style={styles.itemName}>{item.productName}</Text>
                    <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
                    <Text style={styles.itemTotal}>
                        Total: ${(item.price * item.quantity).toFixed(2)}
                    </Text>
                </View>

                <View style={styles.quantityContainer}>
                    <TouchableOpacity
                        style={styles.quantityButton}
                        onPress={() => updateQuantity(item.id || "", false)}
                    >
                        <Text style={styles.quantityButtonText}>-</Text>
                    </TouchableOpacity>

                    <Text style={styles.quantityText}>{item.quantity}</Text>

                    <TouchableOpacity
                        style={styles.quantityButton}
                        onPress={() => updateQuantity(item.id || "", true)}
                    >
                        <Text style={styles.quantityButtonText}>+</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => removeItem(item.id || "")}
                >
                    <Text style={styles.removeButtonText}>×</Text>
                </TouchableOpacity>
            </TouchableOpacity>
        </View>
    );

    return (
        <LinearGradient
            colors={["#4c669f", "#3b5998", "#192f6a"]}
            style={styles.container}
        >
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>My Cart 🛒</Text>
                    <Text style={styles.headerSubtitle}>
                        {localCart.length} items • {getSelectedItems().length} selected
                    </Text>
                </View>

                <View style={styles.selectAllContainer}>
                    <TouchableOpacity style={styles.selectAllButton} onPress={selectAllItems}>
                        <Text style={styles.selectAllText}>
                            {localCart.every(item => item.selected) ? "Deselect All" : "Select All"}
                        </Text>
                    </TouchableOpacity>
                </View>

                <ScrollView
                    style={styles.scrollView}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContainer}
                >
                    {localCart.length > 0 ? (
                        localCart.map(renderCartItem)
                    ) : (
                        <View style={styles.emptyCart}>
                            <Text style={styles.emptyCartText}>Your cart is empty</Text>
                            <TouchableOpacity
                                style={styles.shopNowButton}
                                onPress={() => navigation.navigate("Home")}
                            >
                                <Text style={styles.shopNowButtonText}>Shop Now</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </ScrollView>

                {localCart.length > 0 && (
                    <View style={styles.bottomSection}>
                        <View style={styles.totalContainer}>
                            <Text style={styles.totalLabel}>
                                Total ({getSelectedItems().length} items):
                            </Text>
                            <Text style={styles.totalAmount}>${calculateTotal().toFixed(2)}</Text>
                        </View>

                        <TouchableOpacity
                            style={[
                                styles.orderButton,
                                getSelectedItems().length === 0 && styles.orderButtonDisabled,
                            ]}
                            onPress={handleOrder}
                            disabled={getSelectedItems().length === 0}
                        >
                            <Text
                                style={[
                                    styles.orderButtonText,
                                    getSelectedItems().length === 0 && styles.orderButtonTextDisabled,
                                ]}
                            >
                                Order Now ({getSelectedItems().length})
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}
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
    selectAllContainer: {
        paddingHorizontal: 20,
        marginBottom: 10,
    },
    selectAllButton: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 8,
        alignSelf: 'flex-start',
    },
    selectAllText: {
        color: '#ff7f50',
        fontSize: 14,
        fontWeight: '600',
    },
    scrollView: {
        flex: 1,
    },
    scrollContainer: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    cartItemContainer: {
        marginBottom: 15,
    },
    cartItem: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 15,
        padding: 15,
        flexDirection: 'row',
        alignItems: 'center',
    },
    selectionContainer: {
        marginRight: 15,
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#ddd',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    checkboxSelected: {
        backgroundColor: '#ff7f50',
        borderColor: '#ff7f50',
    },
    checkmark: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    itemImage: {
        width: 60,
        height: 60,
        borderRadius: 10,
        marginRight: 15,
    },
    itemDetails: {
        flex: 1,
        marginRight: 10,
    },
    itemName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
        marginBottom: 4,
    },
    itemPrice: {
        fontSize: 14,
        color: '#ff7f50',
        marginBottom: 2,
    },
    itemTotal: {
        fontSize: 14,
        color: '#ddd',
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 10,
    },
    quantityButton: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        width: 30,
        height: 30,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    quantityButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    quantityText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        marginHorizontal: 15,
        minWidth: 20,
        textAlign: 'center',
    },
    removeButton: {
        backgroundColor: 'rgba(255,99,99,0.2)',
        width: 30,
        height: 30,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    removeButtonText: {
        color: '#ff6363',
        fontSize: 20,
        fontWeight: 'bold',
    },
    emptyCart: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 50,
    },
    emptyCartText: {
        color: '#ddd',
        fontSize: 18,
        marginBottom: 20,
    },
    shopNowButton: {
        backgroundColor: '#ff7f50',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 10,
    },
    shopNowButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    bottomSection: {
        backgroundColor: 'rgba(0,0,0,0.3)',
        paddingHorizontal: 20,
        paddingVertical: 20,
        marginBottom:50,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    totalContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    totalLabel: {
        fontSize: 16,
        color: '#ddd',
    },
    totalAmount: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#ff7f50',
    },
    orderButton: {
        backgroundColor: '#ff7f50',
        paddingVertical: 15,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: "#000",
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
    },
    orderButtonDisabled: {
        backgroundColor: 'rgba(255,255,255,0.2)',
    },
    orderButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    orderButtonTextDisabled: {
        color: '#999',
    },
});

export default CartScreen;