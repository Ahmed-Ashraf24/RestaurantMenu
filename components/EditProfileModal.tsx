import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Modal,
    Alert,
    ScrollView,
    KeyboardAvoidingView,
    Platform, SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { auth, db } from '../database/databaseHook';
import { updateEmail, updatePassword, reauthenticateWithCredential, EmailAuthProvider, sendEmailVerification } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';

interface EditProfileModalProps {
    visible: boolean;
    onClose: () => void;
    userData: {
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
    } | null;
    onUpdateSuccess: () => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
                                                               visible,
                                                               onClose,
                                                               userData,
                                                               onUpdateSuccess,
                                                           }) => {
    const [firstName, setFirstName] = useState(userData?.firstName || '');
    const [lastName, setLastName] = useState(userData?.lastName || '');
    const [email, setEmail] = useState(userData?.email || '');
    const [phone, setPhone] = useState(userData?.phone || '');
    const [newPassword, setNewPassword] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [loading, setLoading] = useState(false);

    // Reset form when modal opens
    React.useEffect(() => {
        if (visible && userData) {
            setFirstName(userData.firstName);
            setLastName(userData.lastName);
            setEmail(userData.email);
            setPhone(userData.phone);
            setNewPassword('');
            setCurrentPassword('');
        }
    }, [visible, userData]);

    const reauthenticateUser = async (currentPassword: string) => {
        if (!auth.currentUser || !auth.currentUser.email) {
            throw new Error('No authenticated user found');
        }

        const credential = EmailAuthProvider.credential(
            auth.currentUser.email,
            currentPassword
        );

        await reauthenticateWithCredential(auth.currentUser, credential);
    };

    const handleSave = async () => {
        if (!auth.currentUser) {
            Alert.alert('Error', 'No authenticated user found');
            return;
        }

        // Validation
        if (!firstName.trim() || !lastName.trim() || !email.trim()) {
            Alert.alert('Error', 'Please fill in all required fields');
            return;
        }

        // Check if email or password is being changed
        const emailChanged = email !== userData?.email;
        const passwordChanged = newPassword.trim() !== '';

        if ((emailChanged || passwordChanged) && !currentPassword.trim()) {
            Alert.alert(
                'Authentication Required',
                'Please enter your current password to update email or password'
            );
            return;
        }

        setLoading(true);

        try {
            // Re-authenticate if needed
            if (emailChanged || passwordChanged) {
                await reauthenticateUser(currentPassword);
            }

            // Update Firestore data first (excluding email if it's being changed)
            const userDocRef = doc(db, 'users', auth.currentUser.uid);
            const updateData: any = {
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                phone: phone.trim(),
            };

            // Only update email in Firestore if it's not changing in Auth
            if (!emailChanged) {
                updateData.email = email.trim();
            }

            await updateDoc(userDocRef, updateData);

            // Update Firebase Auth password if provided
            if (passwordChanged) {
                await updatePassword(auth.currentUser, newPassword);
            }

            // Handle email change with verification
            if (emailChanged) {
                try {
                    await updateEmail(auth.currentUser, email.trim());

                    // Send verification email
                    await sendEmailVerification(auth.currentUser);

                    // Update Firestore with new email after successful Auth update
                    await updateDoc(userDocRef, {
                        email: email.trim(),
                    });

                    Alert.alert(
                        'Email Verification Required',
                        'Your email has been updated, but you need to verify it. A verification email has been sent to your new email address. Please check your inbox and verify your email.',
                        [
                            {
                                text: 'OK',
                                onPress: () => {
                                    onUpdateSuccess();
                                    onClose();
                                },
                            },
                        ]
                    );
                } catch (emailError: any) {
                    if (emailError.code === 'auth/operation-not-allowed') {
                        Alert.alert(
                            'Email Verification Required',
                            'To change your email, you need to verify your current email first. Please check your inbox for a verification email and verify your account before changing your email.',
                            [
                                {
                                    text: 'Send Verification Email',
                                    onPress: async () => {
                                        try {
                                            await sendEmailVerification(auth.currentUser!);
                                            Alert.alert(
                                                'Verification Email Sent',
                                                'Please check your current email inbox and verify your account, then try changing your email again.'
                                            );
                                        } catch (verifyError) {
                                            Alert.alert('Error', 'Failed to send verification email');
                                        }
                                    },
                                },
                                {
                                    text: 'OK',
                                    onPress: () => {
                                        onUpdateSuccess();
                                        onClose();
                                    },
                                },
                            ]
                        );
                        return;
                    }
                    throw emailError;
                }
            } else {
                Alert.alert(
                    'Success',
                    'Profile updated successfully!',
                    [
                        {
                            text: 'OK',
                            onPress: () => {
                                onUpdateSuccess();
                                onClose();
                            },
                        },
                    ]
                );
            }
        } catch (error: any) {
            console.log('Error updating profile:', error);

            let errorMessage = 'Failed to update profile. Please try again.';

            if (error.code === 'auth/wrong-password') {
                errorMessage = 'Current password is incorrect';
            } else if (error.code === 'auth/email-already-in-use') {
                errorMessage = 'This email is already in use by another account';
            } else if (error.code === 'auth/weak-password') {
                errorMessage = 'Password should be at least 6 characters';
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = 'Please enter a valid email address';
            } else if (error.code === 'auth/requires-recent-login') {
                errorMessage = 'Please sign out and sign back in, then try again';
            }

            Alert.alert('Error', errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        // Reset form to original values
        if (userData) {
            setFirstName(userData.firstName);
            setLastName(userData.lastName);
            setEmail(userData.email);
            setPhone(userData.phone);
        }
        setNewPassword('');
        setCurrentPassword('');
        onClose();
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={onClose}
        >
            <LinearGradient
                colors={["#4c669f", "#3b5998", "#192f6a"]}
                style={styles.container}
            >
                <SafeAreaView style={styles.safeArea}>
                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        style={styles.keyboardAvoid}
                    >
                        <ScrollView
                            contentContainerStyle={styles.scrollContainer}
                            showsVerticalScrollIndicator={false}
                        >
                            <View style={styles.header}>
                                <Text style={styles.title}>Edit Profile ✏️</Text>
                                <Text style={styles.subtitle}>Update your information</Text>
                            </View>

                            <View style={styles.formContainer}>
                                <View style={styles.nameRow}>
                                    <TextInput
                                        placeholder="First Name"
                                        placeholderTextColor="#ccc"
                                        style={[styles.input, styles.nameInput]}
                                        value={firstName}
                                        onChangeText={setFirstName}
                                    />
                                    <TextInput
                                        placeholder="Last Name"
                                        placeholderTextColor="#ccc"
                                        style={[styles.input, styles.nameInput]}
                                        value={lastName}
                                        onChangeText={setLastName}
                                    />
                                </View>

                                <TextInput
                                    placeholder="Email Address"
                                    placeholderTextColor="#ccc"
                                    style={styles.input}
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />

                                <TextInput
                                    placeholder="Phone Number"
                                    placeholderTextColor="#ccc"
                                    style={styles.input}
                                    value={phone}
                                    onChangeText={setPhone}
                                    keyboardType="phone-pad"
                                />

                                <View style={styles.passwordSection}>
                                    <Text style={styles.sectionLabel}>Security (Optional)</Text>

                                    <TextInput
                                        placeholder="New Password (leave blank to keep current)"
                                        placeholderTextColor="#ccc"
                                        style={styles.input}
                                        value={newPassword}
                                        onChangeText={setNewPassword}
                                        secureTextEntry
                                    />

                                    <TextInput
                                        placeholder="Current Password (required for email/password changes)"
                                        placeholderTextColor="#ccc"
                                        style={styles.input}
                                        value={currentPassword}
                                        onChangeText={setCurrentPassword}
                                        secureTextEntry
                                    />
                                </View>
                            </View>

                            <View style={styles.buttonContainer}>
                                <TouchableOpacity
                                    style={[styles.button, styles.cancelButton]}
                                    onPress={handleCancel}
                                    disabled={loading}
                                >
                                    <Text style={[styles.buttonText, styles.cancelButtonText]}>
                                        Cancel
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[styles.button, styles.saveButton]}
                                    onPress={handleSave}
                                    disabled={loading}
                                >
                                    <Text style={styles.buttonText}>
                                        {loading ? 'Saving...' : 'Save Changes'}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </KeyboardAvoidingView>
                </SafeAreaView>
            </LinearGradient>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    safeArea: {
        flex: 1,
    },
    keyboardAvoid: {
        flex: 1,
    },
    scrollContainer: {
        flexGrow: 1,
        paddingBottom: 20,
    },
    header: {
        paddingHorizontal: 30,
        paddingVertical: 30,
        alignItems: 'center',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 10,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#ddd',
        textAlign: 'center',
    },
    formContainer: {
        paddingHorizontal: 30,
        marginBottom: 30,
    },
    nameRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    nameInput: {
        flex: 0.48,
    },
    input: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
        color: '#fff',
        fontSize: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    passwordSection: {
        marginTop: 20,
    },
    sectionLabel: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 15,
        textAlign: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        paddingHorizontal: 30,
        justifyContent: 'space-between',
    },
    button: {
        flex: 0.48,
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
    },
    cancelButton: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    saveButton: {
        backgroundColor: '#ff7f50',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    cancelButtonText: {
        color: '#ddd',
    },
});

export default EditProfileModal;