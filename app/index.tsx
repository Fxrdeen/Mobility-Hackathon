import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function Index() {
  const onPress = () => {
    router.push("/(tabs)/home");
  };
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <TouchableOpacity
        className="flex justify-center bg-blue-400 rounded-full w-44 h-20"
        onPress={onPress}
      >
        <Text className="text-white text-center text-3xl">Auth</Text>
      </TouchableOpacity>
    </View>
  );
}
