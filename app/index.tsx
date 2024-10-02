import { router } from "expo-router";
import { Text, TouchableOpacity, View, Image } from "react-native";

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
        backgroundColor: "black",
      }}
    >
      <Image
        source={require("../assets/images/w2.gif")}
        style={{ width: 200, height: 200, resizeMode: 'contain' }}
      />

      <TouchableOpacity
        className="flex justify-center bg-gray-300 rounded-full w-64 h-20"
        onPress={onPress}
      >
        <Text className="text-black text-center text-3xl">Start Walking</Text>
      </TouchableOpacity>
    </View>
  );
}
