import { View, Text, StyleSheet, ImageBackground, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function SlideOne() {
  const router = useRouter();
  return (
    <ImageBackground
      source={require('../../assets/images/view.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Image 
          source={require('../../assets/images/whitelogo.png')} 
          style={styles.logo} 
        />
        <View style={styles.card}>
          <Text style={styles.title}>
            Guided Self-Checks 
          </Text>
          <Text style={styles.subtitle}>
            Step-by-step instructions for regular self-exams.
          </Text>
          <TouchableOpacity 
            style={styles.button}  
            onPress={() => router.push('../welcomeScreens/slideTwo')}
          >
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'space-between',
  },
  logo: {
    width: 200,
    height: 200,
    alignSelf: 'center',
    marginTop: 60,
    resizeMode: 'contain',
  },
  title: {
    color: '#fff',
    fontSize: 28,
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  button: {
    width: '90%',
    borderRadius: 30,
    backgroundColor: "#fff",
    paddingVertical: 15,
    marginTop: 30,
    alignSelf: 'center',
  },
  card: {
    backgroundColor: '#F79FC3',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    padding: 25,
    paddingBottom: 40,
    height: '30%',
    justifyContent: 'flex-start',
  },
  buttonText: {
    fontSize: 18,
    color: "#C85383",
    fontWeight: "bold",
    textAlign: 'center',
  },
  subtitle: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  }
});