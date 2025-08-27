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
import { useUserData } from "../context/UserDataProvider";

interface Order {
    id?: string;
    productName: string;
    price: number;
    imageUrl: string;
    quantity: number;
    date: Date;
}

const OrderScreen: React.FC<any> = ({ navigation }) => {
    const { orders, refreshData } = useUserData();
    const [localOrders, setLocalOrders] = useState<Order[]>([]);

    // Keep localOrders in sync when provider orders changes
    useEffect(() => {
        const sortedOrders = [...orders].sort((a, b) => {
            const dateA = getDateValue(a.date);
            const dateB = getDateValue(b.date);
            return dateB - dateA;
        });
        setLocalOrders(sortedOrders);
    }, [orders]);

    const getDateValue = (date: any): number => {
        if (!date) return 0;

        // Handle Firestore Timestamp
        if (date.toDate && typeof date.toDate === 'function') {
            return date.toDate().getTime();
        }
        // Handle string date
        if (typeof date === 'string') {
            return new Date(date).getTime();
        }
        // Handle Date object
        if (date instanceof Date) {
            return date.getTime();
        }
        // Handle timestamp number
        if (typeof date === 'number') {
            return date;
        }
        return 0;
    };

    const formatDate = (date: any) => {
        let orderDate: Date;

        if (!date) return 'Unknown date';

        // Handle Firestore Timestamp
        if (date.toDate && typeof date.toDate === 'function') {
            orderDate = date.toDate();
        }
        // Handle string date
        else if (typeof date === 'string') {
            orderDate = new Date(date);
        }
        // Handle Date object
        else if (date instanceof Date) {
            orderDate = date;
        }
        // Handle timestamp number
        else if (typeof date === 'number') {
            orderDate = new Date(date);
        }
        else {
            return 'Invalid date';
        }

        // Check if date is valid
        if (isNaN(orderDate.getTime())) {
            return 'Invalid date';
        }

        return orderDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getTotalSpent = () =>
        localOrders.reduce((total, order) => total + order.price * order.quantity, 0);

    const getOrdersByDate = () => {
        const grouped: { [key: string]: Order[] } = {};
        localOrders.forEach(order => {
            const dateKey = new Date(order.date).toDateString();
            if (!grouped[dateKey]) {
                grouped[dateKey] = [];
            }
            grouped[dateKey].push(order);
        });
        return grouped;
    };

    const handleReorder = (order: Order) => {
        Alert.alert(
            "Reorder Item",
            `Add ${order.productName} to cart again?`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Add to Cart",
                    onPress: () => {
                        // You would call addToCart here with the order item
                        console.log("Reordering:", order);
                        Alert.alert("Added to Cart!", `${order.productName} has been added to your cart.`);
                    },
                },
            ]
        );
    };

    const refreshOrders = async () => {
        await refreshData();
        Alert.alert("Refreshed", "Your orders have been updated.");
    };

    const renderOrderItem = (order: Order) => (
        <View key={`${order.id}-${order.date}`} style={styles.orderItemContainer}>
            <TouchableOpacity
                style={styles.orderItem}
                activeOpacity={0.7}
                onPress={() => handleReorder(order)}
            >
                {/* Order Status Indicator */}
                <View style={styles.statusContainer}>
                    <View style={styles.statusIndicator}>
                        <Text style={styles.statusText}>✓</Text>
                    </View>
                </View>

                {/* Item Image */}
                <Image source={{ uri: order.imageUrl }} style={styles.itemImage} />

                {/* Item Details */}
                <View style={styles.itemDetails}>
                    <Text style={styles.itemName}>{order.productName}</Text>
                    <Text style={styles.itemPrice}>${order.price.toFixed(2)} each</Text>
                    <Text style={styles.orderDate}>{formatDate(order.date)}</Text>
                    <Text style={styles.itemTotal}>
                        Total: ${(order.price * order.quantity).toFixed(2)}
                    </Text>
                </View>

                {/* Quantity Display */}
                <View style={styles.quantityContainer}>
                    <Text style={styles.quantityLabel}>Qty</Text>
                    <Text style={styles.quantityText}>{order.quantity}</Text>
                </View>

                {/* Reorder Button */}
                <TouchableOpacity
                    style={styles.reorderButton}
                    onPress={() => handleReorder(order)}
                >
                    <Text style={styles.reorderButtonText}>↻</Text>
                </TouchableOpacity>
            </TouchableOpacity>
        </View>
    );

    const renderOrdersByDate = () => {
        const groupedOrders = getOrdersByDate();
        return Object.entries(groupedOrders).map(([dateKey, dayOrders]) => (
            <View key={dateKey} style={styles.dateGroup}>
                <Text style={styles.dateHeader}>
                    {new Date(dateKey).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })}
                </Text>
                {dayOrders.map(renderOrderItem)}
            </View>
        ));
    };

    return (
        <LinearGradient
            colors={["#4c669f", "#3b5998", "#192f6a"]}
            style={styles.container}
        >
            <SafeAreaView style={styles.safeArea}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>My Orders 📦</Text>
                    <Text style={styles.headerSubtitle}>
                        {localOrders.length} orders • ${getTotalSpent().toFixed(2)} total spent
                    </Text>
                </View>

                {/* Refresh Button */}
                <View style={styles.refreshContainer}>
                    <TouchableOpacity style={styles.refreshButton} onPress={refreshOrders}>
                        <Text style={styles.refreshText}>Refresh Orders</Text>
                    </TouchableOpacity>
                </View>

                {/* Orders List */}
                <ScrollView
                    style={styles.scrollView}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContainer}
                >
                    {localOrders.length > 0 ? (
                        renderOrdersByDate()
                    ) : (
                        <View style={styles.emptyOrders}>
                            <Text style={styles.emptyOrdersText}>No orders yet</Text>
                            <Text style={styles.emptyOrdersSubtext}>
                                Start shopping to see your order history
                            </Text>
                            <TouchableOpacity
                                style={styles.shopNowButton}
                                onPress={() => navigation.navigate("Home")}
                            >
                                <Text style={styles.shopNowButtonText}>Shop Now</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </ScrollView>

                {/* Bottom Summary */}
                {localOrders.length > 0 && (
                    <View style={styles.bottomSection}>
                        <View style={styles.summaryContainer}>
                            <View style={styles.summaryRow}>
                                <Text style={styles.summaryLabel}>Total Orders:</Text>
                                <Text style={styles.summaryValue}>{localOrders.length}</Text>
                            </View>
                            <View style={styles.summaryRow}>
                                <Text style={styles.summaryLabel}>Total Spent:</Text>
                                <Text style={styles.summaryAmount}>${getTotalSpent().toFixed(2)}</Text>
                            </View>
                        </View>

                        <TouchableOpacity
                            style={styles.continueShoppingButton}
                            onPress={() => navigation.navigate("Home")}
                        >
                            <Text style={styles.continueShoppingButtonText}>
                                Continue Shopping
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
    refreshContainer: {
        paddingHorizontal: 20,
        marginBottom: 10,
    },
    refreshButton: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 8,
        alignSelf: 'flex-start',
    },
    refreshText: {
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
    dateGroup: {
        marginBottom: 20,
    },
    dateHeader: {
        fontSize: 18,
        fontWeight: '600',
        color: '#ff7f50',
        marginBottom: 10,
        paddingHorizontal: 5,
    },
    orderItemContainer: {
        marginBottom: 10,
    },
    orderItem: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 15,
        padding: 15,
        flexDirection: 'row',
        alignItems: 'center',
    },
    statusContainer: {
        marginRight: 15,
    },
    statusIndicator: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#4CAF50',
        justifyContent: 'center',
        alignItems: 'center',
    },
    statusText: {
        color: '#fff',
        fontSize: 14,
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
    orderDate: {
        fontSize: 12,
        color: '#bbb',
        marginBottom: 2,
    },
    itemTotal: {
        fontSize: 14,
        color: '#ddd',
        fontWeight: '500',
    },
    quantityContainer: {
        alignItems: 'center',
        marginRight: 10,
    },
    quantityLabel: {
        fontSize: 12,
        color: '#bbb',
        marginBottom: 2,
    },
    quantityText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        minWidth: 20,
        textAlign: 'center',
    },
    reorderButton: {
        backgroundColor: 'rgba(255,127,80,0.2)',
        width: 30,
        height: 30,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    reorderButtonText: {
        color: '#ff7f50',
        fontSize: 18,
        fontWeight: 'bold',
    },
    emptyOrders: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 50,
    },
    emptyOrdersText: {
        color: '#ddd',
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 10,
    },
    emptyOrdersSubtext: {
        color: '#bbb',
        fontSize: 16,
        marginBottom: 20,
        textAlign: 'center',
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
        marginBottom: 50,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    summaryContainer: {
        marginBottom: 15,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    summaryLabel: {
        fontSize: 16,
        color: '#ddd',
    },
    summaryValue: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
    summaryAmount: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#ff7f50',
    },
    continueShoppingButton: {
        backgroundColor: '#ff7f50',
        paddingVertical: 15,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: "#000",
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
    },
    continueShoppingButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default OrderScreen;