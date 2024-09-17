import { Tabs } from "expo-router";
import Feather from "@expo/vector-icons/Feather";

const Layout = () => (
  <Tabs
    initialRouteName="index"
    screenOptions={{
      tabBarActiveTintColor: "white",
      tabBarInactiveTintColor: "white",
      tabBarActiveBackgroundColor: "grey",
      tabBarStyle: {
        backgroundColor: "#333333",
        borderRadius: 5,
      },
      tabBarItemStyle: {
        borderRadius: 10,
      },
    }}
  >
    <Tabs.Screen
      name="home"
      options={{
        title: "Home",
        headerShown: false,
        tabBarIcon: () => <Feather name="target" size={24} color="white" />,
      }}
    />
    <Tabs.Screen
      name="upload"
      options={{
        title: "Upload",
        headerShown: false,
        tabBarIcon: () => <Feather name="upload" size={24} color="white" />,
      }}
    />
  </Tabs>
);

export default Layout;
