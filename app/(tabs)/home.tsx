import CustomButton from "@/components/CustomButton";
import GoogleTextInput from "@/components/GoogleTextInput";
import { icons, images } from "@/constants";
import { useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import MapView from "react-native-maps";
import ReactNativeModal from "react-native-modal";
import { SafeAreaView } from "react-native-safe-area-context";
import AntDesign from "@expo/vector-icons/AntDesign";
const Home = () => {
  const [location, setLocation] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const onPress = () => setShowSuccessModal(true);
  return (
    <SafeAreaView className="flex-1">
      <View className="h-[80%] w-full mb-2">
        <MapView
          className="w-[100%] h-[100%] border-b-2"
          showsUserLocation={true}
        />
      </View>
      <GoogleTextInput
        containerStyle="bg-neutral-100"
        textInputBackgroundColor="transparent"
        icon={icons.map}
        handlePress={() => {}}
      />
      <Text className="text-2xl">{location}</Text>
      <View className="flex items-center justify-center">
        <TouchableOpacity
          onPress={onPress}
          className="flex justify-center items-center bg-gray-400 rounded-xl w-44 h-20"
        >
          <Text className="text-white text-center text-2xl">Check Status</Text>
        </TouchableOpacity>
      </View>
      <ReactNativeModal isVisible={showSuccessModal}>
        <View className="flex flex-col justify-center items-center bg-white px-7 py-9 rounded-2xl min-h-[300px]">
          <AntDesign name="earth" size={50} color="black" />
          <Text className="text-3xl font-JakartaBold text-center mb-2 mt-4">
            Score of street XXX:
          </Text>
          <Text className="text-3xl  font-JakartaBold text-center mb-5">
            6969
          </Text>
          <Text className="text-base text-gray-400 font-JakartaBold text-center">
            The street selected is: Not Walkable
          </Text>
          <Text className="mt-2 mb-3 text-xl text-red-400 font-JakartaBold text-center">
            Not Recommended to walk!
          </Text>
          <CustomButton
            title="Close"
            onPress={() => {
              setShowSuccessModal(false);
            }}
            className="mt-5"
          />
        </View>
      </ReactNativeModal>
    </SafeAreaView>
  );
};

export default Home;
