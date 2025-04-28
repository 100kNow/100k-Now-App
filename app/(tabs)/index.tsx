import { StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useRouter } from 'expo-router';

export default function TabOneScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/images/logo.png')} style={styles.image} />

      <Text style={styles.title}>
        Early Detection Saves{'\n'}Lives
      </Text>

      <Text style={styles.subtitle}>Get AI-powered insights on breast health.</Text>

      <Image source={require('../../assets/images/welcome1.jpg')} style={styles.welcomeImage} />

      {/* ───────── Buttons row ───────── */}

        <TouchableOpacity
          style={[styles.button, { marginRight: 12 }]}
          onPress={() => router.push('../welcomeScreens/slideOne')}
        >
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>

      

      <TouchableOpacity
          style={styles.buttonn}
          onPress={() => router.push('../login/login')}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        
      <Text style={styles.bottomText}>
        Already have an account?
        <TouchableOpacity onPress={() => router.push('../login/login')}>
          <Text style={styles.signInButton}> Sign In.</Text>
        </TouchableOpacity>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F79FC3',
  },
  image: {
    marginTop: 30,
    width: 150,
    height: 150,
  },
  title: {
    fontSize: 35,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 20,
  },
  subtitle: {
    fontSize: 20,
    color: '#fff',
    marginTop: 10,
    textAlign: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  welcomeImage: {
    width: '100%',
    height: 300,
    marginTop: 20,
  },
  button: {
    marginTop: 20,
    width: 240,
    borderRadius: 1000,
    backgroundColor: '#fff',
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonn: {
    width: 140,
    borderRadius: 1000,

    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    color: '#C85383',
    fontWeight: 'bold',
  },
  bottomText: {
marginTop: 20,
    width: '100%',
    fontWeight: 'bold',
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
  },
  signInButton: {
    fontSize: 16,
    color: '#C85383',
  },
});
