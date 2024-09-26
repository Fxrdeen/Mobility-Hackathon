import CustomButton from "@/components/CustomButton";
import GoogleTextInput from "@/components/GoogleTextInput";
import { icons, images } from "@/constants";
import { useEffect, useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import MapView from "react-native-maps";
import ReactNativeModal from "react-native-modal";
import { SafeAreaView } from "react-native-safe-area-context";
import AntDesign from "@expo/vector-icons/AntDesign";
import MapComponent from "@/components/MapView";
import { getSupabase } from "@/server";

const roadData = [
  {
    coordinates: [
      { latitude: 12.9716, longitude: 77.5946 },
      { latitude: 12.9756, longitude: 77.5986 },
    ],
    score: 10,
  },
  {
    coordinates: [
      { latitude: 12.9806, longitude: 77.5996 },
      { latitude: 12.9826, longitude: 77.6016 },
    ],
    score: 80,
  },
];
const Home = () => {
  const [location, setLocation] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [ldata, setLdata] = useState([]);
  const onPress = () => setShowSuccessModal(true);
  const road = getSupabase();
  useEffect(() => {
    const func = async () => {
      const road = await getSupabase();
      setLdata(road);
    };
    func();
  }, []);
  console.log(ldata);
  if (ldata != null) {
    ldata.map((item) => {
      roadData.push({
        coordinates: [
          {
            latitude: item.latitude!,
            longitude: item.longitude!,
          },
          {
            latitude: item.latitude + 0.005,
            longitude: item.longitude + 0.005,
          },
        ],
        score: item.score,
      });
    });
  }
  return (
    <SafeAreaView className="flex-1 bg-[#121212] p-5">
      <View className="h-[80%] w-full mb-2">
        <MapComponent
          //className="w-[100%] h-[100%] border-b-2"
          //showsUserLocation={true}
          roadData={roadData}
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
