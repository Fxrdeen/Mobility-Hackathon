import CustomButton from "@/components/CustomButton";
import GoogleTextInput from "@/components/GoogleTextInput";
import { icons, images } from "@/constants";
import { useEffect, useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import ReactNativeModal from "react-native-modal";
import { SafeAreaView } from "react-native-safe-area-context";
import AntDesign from "@expo/vector-icons/AntDesign";
import MapComponent from "@/components/MapView";
import { getSupabase } from "@/server";
import useStore from "@/store";
import Geolocation from "@react-native-community/geolocation";
import { useIsFocused } from "@react-navigation/native";
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
      { latitude: 12.888111427122361, longitude: 77.54338434280378 },
      { latitude: 12.888765911321904, longitude: 77.54361193578372 },
    ],
    score: 80,
  },
];
const Home = () => {
  const [location, setLocation] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [modalData, setModalData] = useState<any>(null);
  const [newlocation, setnewlocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const Lat = useStore((state: any) => state.Lat);
  const setLat = useStore((state: any) => state.setLat);
  const Lng = useStore((state: any) => state.Lng);
  const [modalAddress, setModalAddress] = useState("");
  const setLng = useStore((state: any) => state.setLng);
  const [ldata, setLdata] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState<Coordinate | null>(
    null
  );
  const isFocused = useIsFocused();
  const onPress = () => setShowSuccessModal(true);
  const road = getSupabase();
  useEffect(() => {
    if (isFocused) {
      const func = async () => {
        const road = await getSupabase();
        setLdata(road);
      };
      func();
    }

    const func2 = async () => {
      const address = await getAddressFromCoordinates(
        modalData.coordinates[0].latitude,
        modalData.coordinates[0].longitude
      );
      setModalAddress(address || "");
      console.log(address);
    };
    if (modalData != null) {
      func2();
    }
  }, [modalData, isFocused]);

  const getAddressFromCoordinates = async (
    latitude: number,
    longitude: number
  ) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${process.env.EXPO_PUBLIC_GOOGLE_API_KEY}`
      );
      const data = await response.json();

      if (data.status === "OK") {
        const address = data.results[0].formatted_address;
        return address;
      } else {
        console.log("Geocoding failed:", data.status);
        return null;
      }
    } catch (error) {
      console.log("Error:", error);
      return null;
    }
  };

  const handleLocationSelect = (coords: {
    latitude: number;
    longitude: number;
  }) => {
    setnewlocation(coords);
    setLat(coords.latitude);
    setLng(coords.longitude);
    setSelectedLocation(coords); // Update selectedLocation state
  };
  //console.log(ldata);
  if (ldata != null) {
    ldata.map((item) => {
      //console.log(item);
      roadData.push({
        coordinates: [
          {
            latitude: item.latitude!,
            longitude: item.longitude!,
          },
          {
            latitude: item.latitude_end,
            longitude: item.longitude_end,
          },
        ],
        score: item.score,
      });
    });
  }

  const handleModalData = (data: any) => {
    console.log("Selected data:", data);
    setModalData(data!);
  };
  return (
    <SafeAreaView className="flex-1 bg-[#121212] p-5">
      <View className="h-[80%] w-full mb-2">
        <MapComponent
          roadData={roadData}
          selectedLocation={selectedLocation} // Pass selectedLocation to MapComponent
          onMarkerPress={handleModalData}
        />
      </View>
      <GoogleTextInput
        containerStyle="bg-neutral-100"
        textInputBackgroundColor="transparent"
        icon={icons.map}
        handlePress={() => {}}
        onLocationSelect={handleLocationSelect}
      />
      <Text className="text-2xl">{location}</Text>
      <View className="flex items-center justify-center">
        <TouchableOpacity
          onPress={onPress}
          className="flex justify-center items-center bg-gray-400 rounded-xl w-44 h-[70px] mt-[-30px]"
        >
          <Text className="text-white text-center text-2xl">Check Status</Text>
        </TouchableOpacity>
      </View>
      {modalData && (
        <ReactNativeModal isVisible={showSuccessModal}>
          <View className="flex flex-col justify-center items-center bg-white px-7 py-9 rounded-2xl min-h-[300px]">
            <AntDesign name="earth" size={50} color="black" />
            <Text className="text-lg font-JakartaBold text-center mb-2 mt-4">
              Score of {modalAddress}:
            </Text>
            <Text className="text-3xl  font-JakartaBold text-center mb-5">
              {modalData.score}
            </Text>
            <Text className="text-base text-gray-400 font-JakartaBold text-center">
              [{modalData.coordinates[0].latitude},
              {modalData.coordinates[0].longitude}] - [
              {modalData.coordinates[1].latitude},
              {modalData.coordinates[1].longitude}]
            </Text>
            <Text
              className={`mt-2 mb-3 text-xl text-red-400 font-JakartaBold text-center ${
                modalData.score < 50 ? "text-red-400" : "text-green-400"
              }`}
            >
              {modalData.score < 50
                ? "Not Recommended to walk!"
                : "Safe to walk!"}
            </Text>
            <CustomButton
              title="Close"
              onPress={() => {
                setShowSuccessModal(false);
                setModalData(null);
              }}
              className="mt-5"
            />
          </View>
        </ReactNativeModal>
      )}
    </SafeAreaView>
  );
};

export default Home;
