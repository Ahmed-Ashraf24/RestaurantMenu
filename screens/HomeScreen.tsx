import React, {useState, useEffect} from 'react';
import {
    FlatList,
    StyleSheet,
    SafeAreaView,
    Text,
    View,
    TouchableOpacity,
    TextInput,
} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import ProductCard from '../components/ProductCard';

interface Product {
    id: string;
    name: string;
    price: number;
    image: string;
    category: string;
    size?: string;
    dietary?: string;
    spiceLevel?: string;
}

const allProducts: Product[] = [
    {
        id: '1',
        name: 'Double Whopper',
        price: 29.57,
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxXwYBrFVpP3OGlJQpmHqfZmqu5j5iAD53gg&s',
        category: 'Burgers',
        size: 'Large',
        dietary: 'Regular',
        spiceLevel: 'Mild'
    },
    {
        id: '2',
        name: 'Steakhouse XL',
        price: 35.65,
        image: 'https://www.foodandwine.com/thmb/DI29Houjc_ccAtFKly0BbVsusHc=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/crispy-comte-cheesburgers-FT-RECIPE0921-6166c6552b7148e8a8561f7765ddf20b.jpg',
        category: 'Burgers',
        size: 'Extra Large',
        dietary: 'Regular',
        spiceLevel: 'Medium'
    },
    {
        id: '3',
        name: 'Classic Beef Burger',
        price: 25.50,
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSyThLTtFMkSJjyz2FM_2C_EJqGNdzMWdYfdg&s',
        category: 'Burgers',
        size: 'Medium',
        dietary: 'Regular',
        spiceLevel: 'Mild'
    },
    {
        id: '4',
        name: 'Premium Deluxe',
        price: 42.75,
        image: 'https://cdnph.upi.com/svc/sv/i/4621368144832/2013/1/13681450826632/McDonalds-to-stop-selling-premium-Angus-burgers.jpg',
        category: 'Burgers',
        size: 'Large',
        dietary: 'Regular',
        spiceLevel: 'Hot'
    },
    {
        id: '5',
        name: 'BBQ Special',
        price: 38.90,
        image: 'https://bsstatic2.mrjack.es/wp-content/uploads/2020/09/hamburguesa-bbq-cab.jpg',
        category: 'Burgers',
        size: 'Large',
        dietary: 'Regular',
        spiceLevel: 'Medium'
    },
    {
        id: '6',
        name: 'Veggie Delight',
        price: 24.25,
        image: 'https://dukaan.b-cdn.net/1000x1000/webp/590610/5868aea2-f274-4eab-822f-27da13d4a499.png',
        category: 'Burgers',
        size: 'Medium',
        dietary: 'Vegetarian',
        spiceLevel: 'Mild'
    },
    // Pizza
    {
        id: '7',
        name: 'Margherita Pizza',
        price: 22.50,
        image: 'https://www.tasteofhome.com/wp-content/uploads/2024/03/Margherita-Pizza-_EXPS_TOHVP24_275515_MF_02_28_1.jpg',
        category: 'Pizza',
        size: 'Large',
        dietary: 'Vegetarian'
    },
    {
        id: '8',
        name: 'Pepperoni Supreme',
        price: 28.90,
        image: 'https://images.eatsmarter.com/sites/default/files/styles/1600x1200/public/pepperoni-supreme-pizza-506949.jpg',
        category: 'Pizza',
        size: 'Large',
        dietary: 'Regular'
    },
    // Chicken
    {
        id: '9',
        name: 'Crispy Chicken',
        price: 26.75,
        image: 'https://static.toiimg.com/thumb/75579926.cms?width=1200&height=900',
        category: 'Chicken',
        size: 'Medium',
        dietary: 'Regular',
        spiceLevel: 'Medium'
    },
    {
        id: '10',
        name: 'Buffalo Wings',
        price: 19.99,
        image: 'https://easychickenrecipes.com/wp-content/uploads/2023/08/featured-buffalo-wings-recipe-500x500.jpg',
        category: 'Chicken',
        size: 'Small',
        dietary: 'Regular',
        spiceLevel: 'Hot'
    },
];

const quickFilters = [
    {label: 'All', emoji: '🍽️', category: ''},
    {label: 'Burgers', emoji: '🍔', category: 'Burgers'},
    {label: 'Pizza', emoji: '🍕', category: 'Pizza'},
    {label: 'Chicken', emoji: '🍗', category: 'Chicken'},
    {label: 'Fries', emoji: '🍟', category: 'Fries'},
    {label: 'Drinks', emoji: '🥤', category: 'Drinks'},
];

interface HomeScreenProps {
    navigation: any;
    route?: any;
}

const HomeScreen: React.FC<HomeScreenProps> = ({navigation, route}) => {
    const [filteredProducts, setFilteredProducts] = useState<Product[]>(allProducts);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [selectedQuickFilter, setSelectedQuickFilter] = useState<string>('');
    const [appliedFilters, setAppliedFilters] = useState<any>(null);


    useEffect(() => {
        if (route?.params?.filters) {
            setAppliedFilters(route.params.filters);
            applyFilters(route.params.filters, searchQuery);
        }
    }, [route?.params?.filters]);

    useEffect(() => {
        applyFilters(appliedFilters, searchQuery, selectedQuickFilter);
    }, [searchQuery, selectedQuickFilter]);

    const applyFilters = (filters: any, search: string, quickFilter?: string) => {
        let filtered = [...allProducts];


        if (search.trim()) {
            filtered = filtered.filter(product =>
                product.name.toLowerCase().includes(search.toLowerCase())
            );
        }

        if (quickFilter && quickFilter !== '') {
            filtered = filtered.filter(product => product.category === quickFilter);
        }

        if (filters) {
            if (filters.category && filters.category !== 'All') {
                filtered = filtered.filter(product => product.category === filters.category);
            }
            if (filters.size) {
                filtered = filtered.filter(product => product.size === filters.size);
            }
            if (filters.priceRange) {
                filtered = applyPriceFilter(filtered, filters.priceRange);
            }
            if (filters.dietary) {
                filtered = filtered.filter(product => product.dietary === filters.dietary);
            }
            if (filters.spiceLevel) {
                filtered = filtered.filter(product => product.spiceLevel === filters.spiceLevel);
            }
        }

        setFilteredProducts(filtered);
    };

    const applyPriceFilter = (products: Product[], priceRange: string) => {
        switch (priceRange) {
            case 'Under $5':
                return products.filter(p => p.price < 5);
            case '$5 - $10':
                return products.filter(p => p.price >= 5 && p.price <= 10);
            case '$10 - $15':
                return products.filter(p => p.price >= 10 && p.price <= 15);
            case 'Above $15':
                return products.filter(p => p.price > 15);
            default:
                return products;
        }
    };

    const handleQuickFilter = (category: string) => {
        setSelectedQuickFilter(category);
        setAppliedFilters(null);
    };

    const openFilterScreen = () => {
        navigation.navigate('FastFoodFilter');
    };

    const clearAllFilters = () => {
        setSearchQuery('');
        setSelectedQuickFilter('');
        setAppliedFilters(null);
        setFilteredProducts(allProducts);
    };

    const getActiveFiltersCount = () => {
        let count = 0;
        if (searchQuery.trim()) count++;
        if (selectedQuickFilter) count++;
        if (appliedFilters) {
            if (appliedFilters.size) count++;
            if (appliedFilters.priceRange) count++;
            if (appliedFilters.dietary) count++;
            if (appliedFilters.spiceLevel) count++;
        }
        return count;
    };

    const renderProduct = ({item}: { item: Product }) => (
        <ProductCard
            id={item.id}
            name={item.name}
            price={item.price}
            image={item.image}
        />
    );

    const renderQuickFilter = ({item}: { item: typeof quickFilters[0] }) => (
        <TouchableOpacity
            style={[
                styles.quickFilterChip,
                selectedQuickFilter === item.category ? styles.activeQuickFilter : styles.inactiveQuickFilter
            ]}
            onPress={() => handleQuickFilter(item.category)}
        >
            <Text style={[
                styles.quickFilterText,
                selectedQuickFilter === item.category ? styles.activeQuickFilterText : styles.inactiveQuickFilterText
            ]}>
                {item.emoji} {item.label}
            </Text>
        </TouchableOpacity>
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


                <View style={styles.searchContainer}>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search for food..."
                        placeholderTextColor="#ccc"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>


                <View style={styles.filterControls}>
                    <TouchableOpacity
                        style={styles.filterButton}
                        onPress={openFilterScreen}
                    >
                        <Text style={styles.filterButtonText}>
                            🔍 Filters {getActiveFiltersCount() > 0 && `(${getActiveFiltersCount()})`}
                        </Text>
                    </TouchableOpacity>

                    {getActiveFiltersCount() > 0 && (
                        <TouchableOpacity
                            style={styles.clearButton}
                            onPress={clearAllFilters}
                        >
                            <Text style={styles.clearButtonText}>Clear All</Text>
                        </TouchableOpacity>
                    )}
                </View>


                <View style={styles.quickFiltersContainer}>
                    <FlatList
                        data={quickFilters}
                        renderItem={renderQuickFilter}
                        keyExtractor={(item) => item.label}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.quickFiltersList}
                    />
                </View>

                <View style={styles.resultsInfo}>
                    <Text style={styles.resultsText}>
                        {filteredProducts.length} items found
                        {appliedFilters?.category && ` in ${appliedFilters.category}`}
                    </Text>
                </View>

                <FlatList
                    data={filteredProducts}
                    renderItem={renderProduct}
                    keyExtractor={(item: Product) => item.id}
                    numColumns={2}
                    contentContainerStyle={styles.listContainer}
                    columnWrapperStyle={styles.row}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>😔</Text>
                            <Text style={styles.emptyTitle}>No items found</Text>
                            <Text style={styles.emptySubtitle}>Try adjusting your filters or search terms</Text>
                        </View>
                    }
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
    searchContainer: {
        paddingHorizontal: 20,
        marginBottom: 15,
    },
    searchInput: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        padding: 15,
        borderRadius: 10,
        color: '#fff',
        fontSize: 16,
    },
    filterControls: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        marginBottom: 15,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    filterButton: {
        backgroundColor: '#ff7f50',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    filterButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    clearButton: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 15,
    },
    clearButtonText: {
        color: '#ff7f50',
        fontSize: 12,
        fontWeight: '600',
    },
    quickFiltersContainer: {
        marginBottom: 10,
    },
    quickFiltersList: {
        paddingHorizontal: 15,
    },
    quickFilterChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 10,
        borderWidth: 1,
    },
    activeQuickFilter: {
        backgroundColor: '#ff7f50',
        borderColor: '#ff7f50',
    },
    inactiveQuickFilter: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderColor: 'rgba(255,255,255,0.3)',
    },
    quickFilterText: {
        fontSize: 14,
        fontWeight: '500',
    },
    activeQuickFilterText: {
        color: '#fff',
    },
    inactiveQuickFilterText: {
        color: '#ddd',
    },
    resultsInfo: {
        paddingHorizontal: 20,
        marginBottom: 10,
    },
    resultsText: {
        color: '#ddd',
        fontSize: 14,
        fontStyle: 'italic',
    },
    listContainer: {
        padding: 15,
        paddingTop: 10,
    },
    row: {
        justifyContent: 'space-around',
        marginBottom: 10,
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
    },
    emptyText: {
        fontSize: 48,
        marginBottom: 20,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 10,
    },
    emptySubtitle: {
        fontSize: 16,
        color: '#ddd',
        textAlign: 'center',
        paddingHorizontal: 40,
    },
});

export default HomeScreen;