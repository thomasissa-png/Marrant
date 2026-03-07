import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { HomeScreen } from "../screens/HomeScreen";

// Thème sombre personnalisé
const DarkTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#F5C518",
    background: "#0D0D0D",
    card: "#1A1A1A",
    text: "#FFFFFF",
    border: "#2A2A2A",
    notification: "#FF6B35",
  },
};

const Tab = createBottomTabNavigator();

export function AppNavigator() {
  return (
    <NavigationContainer theme={DarkTheme}>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: "#F5C518",
          tabBarInactiveTintColor: "#666666",
          tabBarStyle: {
            backgroundColor: "#1A1A1A",
            borderTopColor: "#2A2A2A",
          },
        }}
      >
        <Tab.Screen name="Accueil" component={HomeScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
