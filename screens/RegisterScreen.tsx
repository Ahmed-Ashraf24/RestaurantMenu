import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { auth , db} from '../database/databaseHook';
import  { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
const RegisterScreen: React.FC<any> = ({ navigation }) => {
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      alert("Passwords don't match!");
      return;
    }
         try {
        const user = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
         await setDoc(doc(db, "users", user.user.uid), {
      firstName,
      lastName,
      email,
      phone,
      createdAt: new Date().toISOString(),
    });
             navigation.navigate('Login');
        console.log("User created:", user.user);
      } 
      catch (e: Error | any) {
        alert("an error occurred while creating user \nplease be sure to fill the fields and reassure the email")
        console.log("Error:", e.message);
      }

  };

  return (
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
            <View style={styles.innerContainer}>
              <Text style={styles.title}>Join Our Family 🍽️</Text>
              <Text style={styles.subtitle}>Create your account to start ordering</Text>
              
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

              <TextInput
                placeholder="Password"
                placeholderTextColor="#ccc"
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />

              <TextInput
                placeholder="Confirm Password"
                placeholderTextColor="#ccc"
                style={styles.input}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />

              <TouchableOpacity style={styles.button} onPress={handleRegister}>
                <Text style={styles.buttonText}>Create Account</Text>
              </TouchableOpacity>

              <View style={styles.termsContainer}>
                <Text style={styles.termsText}>
                  By creating an account, you agree to our{' '}
                  <Text style={styles.linkText}>Terms of Service</Text> and{' '}
                  <Text style={styles.linkText}>Privacy Policy</Text>
                </Text>
              </View>

              <View style={styles.footer}>
                <Text style={styles.footerText}>Already have an account?</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                  <Text style={styles.loginText}> Sign In</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
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
  keyboardAvoid: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  innerContainer: {
    paddingHorizontal: 30,
    paddingVertical: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: "#ddd",
    marginBottom: 30,
    textAlign: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  nameInput: {
    flex: 0.48,
  },
  input: {
    backgroundColor: "rgba(255,255,255,0.1)",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    color: "#fff",
    fontSize: 16,
  },
  button: {
    backgroundColor: "#ff7f50",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  termsContainer: {
    marginTop: 20,
    paddingHorizontal: 10,
  },
  termsText: {
    color: "#bbb",
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
  },
  linkText: {
    color: "#ff7f50",
    textDecorationLine: 'underline',
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 25,
  },
  footerText: {
    color: "#ccc",
    fontSize: 16,
  },
  loginText: {
    color: "#ff7f50",
    fontWeight: "600",
    fontSize: 16,
  },
});

export default RegisterScreen;