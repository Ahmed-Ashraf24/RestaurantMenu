import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    ScrollView,

    Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { auth, db } from '../database/databaseHook';
import { signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

interface UserData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    createdAt: string;
}

const ProfileScreen: React.FC<any> = ({ navigation }) => {
    const [userData, setUserData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            if (auth.currentUser) {
                const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
                if (userDoc.exists()) {
                    setUserData(userDoc.data() as UserData);
                }
            }
        } catch (error) {
            console.log('Error fetching user data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Logout',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await signOut(auth);
                            navigation.reset({
                                index: 0,
                                routes: [{ name: 'Login' }],
                            });
                        } catch (error) {
                            console.log('Error signing out:', error);
                        }
                    },
                },
            ]
        );
    };

    const getInitials = () => {
        if (userData) {
            return `${userData.firstName.charAt(0)}${userData.lastName.charAt(0)}`.toUpperCase();
        }
        return 'U';
    };

    const formatJoinDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    if (loading) {
        return (
            <LinearGradient
                colors={["#4c669f", "#3b5998", "#192f6a"]}
                style={styles.container}
            >
                <SafeAreaView style={styles.safeArea}>
                    <View style={styles.loadingContainer}>
                        <Text style={styles.loadingText}>Loading profile...</Text>
                    </View>
                </SafeAreaView>
            </LinearGradient>
        );
    }

    return (
        <LinearGradient
            colors={["#4c669f", "#3b5998", "#192f6a"]}
            style={styles.container}
        >
            <SafeAreaView style={styles.safeArea}>
                <ScrollView
                    contentContainerStyle={styles.scrollContainer}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>My Profile 👤</Text>
                    </View>

                    {/* Profile Avatar Section */}
                    <View style={styles.avatarSection}>
                        <View style={styles.avatarContainer}>
                            <Text style={styles.avatarText}>{getInitials()}</Text>
                        </View>
                        <Text style={styles.userName}>
                            {userData ? `${userData.firstName} ${userData.lastName}` : 'User Name'}
                        </Text>
                        <Text style={styles.userEmail}>
                            {userData?.email || 'user@example.com'}
                        </Text>
                    </View>

                    {/* Profile Information */}
                    <View style={styles.infoSection}>
                        <View style={styles.infoCard}>
                            <Text style={styles.sectionTitle}>Personal Information</Text>

                            <View style={styles.infoRow}>
                                <Text style={styles.infoLabel}>First Name</Text>
                                <Text style={styles.infoValue}>{userData?.firstName || 'N/A'}</Text>
                            </View>

                            <View style={styles.infoRow}>
                                <Text style={styles.infoLabel}>Last Name</Text>
                                <Text style={styles.infoValue}>{userData?.lastName || 'N/A'}</Text>
                            </View>

                            <View style={styles.infoRow}>
                                <Text style={styles.infoLabel}>Email</Text>
                                <Text style={styles.infoValue}>{userData?.email || 'N/A'}</Text>
                            </View>

                            <View style={styles.infoRow}>
                                <Text style={styles.infoLabel}>Phone</Text>
                                <Text style={styles.infoValue}>{userData?.phone || 'N/A'}</Text>
                            </View>

                            <View style={styles.infoRow}>
                                <Text style={styles.infoLabel}>Member Since</Text>
                                <Text style={styles.infoValue}>
                                    {userData?.createdAt ? formatJoinDate(userData.createdAt) : 'N/A'}
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* Action Buttons */}
                    <View style={styles.actionsSection}>
                        <TouchableOpacity style={styles.actionButton}>
                            <Text style={styles.actionButtonText}>Edit Profile</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.actionButton}>
                            <Text style={styles.actionButtonText}>Order History</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.actionButton}>
                            <Text style={styles.actionButtonText}>Settings</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.actionButton}>
                            <Text style={styles.actionButtonText}>Help & Support</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.actionButton, styles.logoutButton]}
                            onPress={handleLogout}
                        >
                            <Text style={[styles.actionButtonText, styles.logoutButtonText]}>
                                Logout
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
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
    scrollContainer: {
        flexGrow: 1,
        paddingBottom: 20,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        color: '#fff',
        fontSize: 18,
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
    avatarSection: {
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 30,
    },
    avatarContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
        borderWidth: 3,
        borderColor: '#ff7f50',
    },
    avatarText: {
        color: '#fff',
        fontSize: 36,
        fontWeight: 'bold',
    },
    userName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 5,
    },
    userEmail: {
        fontSize: 16,
        color: '#ddd',
    },
    infoSection: {
        paddingHorizontal: 20,
        marginBottom: 30,
    },
    infoCard: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 15,
        padding: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 20,
        textAlign: 'center',
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.1)',
    },
    infoLabel: {
        fontSize: 16,
        color: '#ddd',
        flex: 1,
    },
    infoValue: {
        fontSize: 16,
        color: '#fff',
        fontWeight: '500',
        flex: 1,
        textAlign: 'right',
    },
    actionsSection: {
        paddingHorizontal: 20,
        marginBottom: 50,
    },
    actionButton: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 12,
        marginBottom: 12,
        alignItems: 'center',
    },
    actionButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    logoutButton: {
        backgroundColor: 'rgba(255,99,99,0.2)',
        marginTop: 10,
        borderWidth: 1,
        borderColor: '#ff6363',
    },
    logoutButtonText: {
        color: '#ff6363',
    },
});

export default ProfileScreen;