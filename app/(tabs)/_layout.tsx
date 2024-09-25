import { Tabs } from "expo-router";
import Feather from "@expo/vector-icons/Feather";

const Layout = () => (
  <Tabs
    initialRouteName="index"
    screenOptions={{
      tabBarActiveTintColor: "yellow",
      tabBarInactiveTintColor: "white",

      tabBarStyle: {
        borderRadius: 5,
        backgroundColor: "black",
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
        tabBarIcon: ({ color }) => (
          <Feather name="target" size={24} color={color} />
        ),
      }}
    />
    <Tabs.Screen
      name="upload"
      options={{
        title: "Upload",
        headerShown: false,
        tabBarIcon: ({ color }) => (
          <Feather name="upload" size={24} color={color} />
        ),
      }}
    />
  </Tabs>
);

export default Layout;
