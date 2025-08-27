import React ,{ useState } from 'react';
import {
    View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView, } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { signInWithEmailAndPassword } from "firebase/auth";
import {auth} from '../database/databaseHook'
const LoginScreen : React.FC<any> =({navigation}) =>{
     const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
   const handleLogin = async () => {
    try{
        const user  = await signInWithEmailAndPassword(auth, email,password);
        navigation.navigate('MainTabs', { screen: 'Home' });
    }
    catch( e:Error | any )
       {
           alert("Error while logging in");
        console.log(e.message);
       }



    console.log("Login with:", email, password);
  };
return (
    <LinearGradient
      colors={["#4c669f", "#3b5998", "#192f6a"]}
      style={styles.container}
    >
      <SafeAreaView style={styles.innerContainer}>
        <Text style={styles.title}>Welcome Back 👋</Text>
        <Text style={styles.subtitle}>Login to continue</Text>

        <TextInput
          placeholder="Email"
          placeholderTextColor="#ccc"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        <TextInput
          placeholder="Password"
          placeholderTextColor="#ccc"
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity style={styles.button} onPress={()=>{
          handleLogin();
        }}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don’t have an account?</Text>
          <TouchableOpacity>
            <Text style={styles.registerText} onPress={()=>{navigation.navigate('Register');}}> Sign up</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#ddd",
    marginBottom: 40,
  },
  input: {
    backgroundColor: "rgba(255,255,255,0.1)",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    color: "#fff",
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
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  footerText: {
    color: "#ccc",
  },
  registerText: {
    color: "#ff7f50",
    fontWeight: "600",
  },
});

export default LoginScreen;