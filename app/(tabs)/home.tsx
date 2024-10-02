import CustomButton from "@/components/CustomButton";
import GoogleTextInput from "@/components/GoogleTextInput";
import { icons } from "@/constants";
import { Rating } from "react-native-ratings";
import { Dialog, Button } from "@rneui/themed";
import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import ReactNativeModal from "react-native-modal";
import { SafeAreaView } from "react-native-safe-area-context";
import AntDesign from "@expo/vector-icons/AntDesign";
import Constants from "expo-constants";
import MapComponent from "@/components/MapView";
import { getSupabase } from "@/server";
import useStore from "@/store";
import { useIsFocused } from "@react-navigation/native";
import { Alert } from "react-native";
import { supabase } from "@/supabase";
import { ActivityIndicator } from 'react-native';

const roadData = [
  {
    coordinates: [
      { latitude: 12.888111427122361, longitude: 77.54338434280378 },
      { latitude: 12.888765911321904, longitude: 77.54361193578372 },
    ],
    score: 80,
    user_rating: 4,
    id: 1,
  }
];
const Home = () => {
  const [location, setLocation] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [modalData, setModalData] = useState<any>(null);
  const [newlocation, setnewlocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const googlePlacesApiKey = Constants.expoConfig?.extra?.EXPO_PUBLIC_GOOGLE_API_KEY
  const Lat = useStore((state: any) => state.Lat);
  const setLat = useStore((state: any) => state.setLat);
  const [modalFinalRating, setModalFinalRating] = useState(0);
  const Lng = useStore((state: any) => state.Lng);
  const [modalVisible, setModalVisible] = useState(true);
  const [modalAddress, setModalAddress] = useState("");
  const [loading, setLoading] = useState(true);

  const [reloadmap, setReloadmap] = useState(false);
  const setLng = useStore((state: any) => state.setLng);
  const [ldata, setLdata] = useState([]);
  const [modalVisible1, setModalVisible1] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [extraRatingAdded, setExtraRatingAdded] = useState(false);
  const [RateAgain, setRateAgain] = useState(0);
  const [selectedLocation, setSelectedLocation] = useState<Coordinate | null>(
    null
  );
  const isFocused = useIsFocused();
  const onPress = () => setShowSuccessModal(true);
  const road = getSupabase();
  useEffect(() => {
    const func = async () => {
      const road = await getSupabase();
      setLdata(road);
    };
    if (isFocused) {

      func();
    }
    if (reloadmap == true) {
      func();
      setReloadmap(false);
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
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${googlePlacesApiKey}`
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
  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
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
  useEffect(() => {
    if (ldata != null || reloadmap == true) {
      ldata.map((item: any) => {
        //console.log(item);
        roadData.push({
          coordinates: [
            {
              latitude: item.latitude,
              longitude: item.longitude,
            },
            {
              latitude: item.latitude_end,
              longitude: item.longitude_end,
            },
          ],
          score: item.score,
          user_rating: item.user_rating,
          id: item.id,
        });
      });
      sleep(3000).then(() => {
        setLoading(false);
      });
    }
  }, [ldata, reloadmap]);

  const handleModalData = (data: any) => {
    console.log("Selected data:", data);
    let rscore = 1 + (data.score / 100) * 4;

    let finalscore = Math.round(data.user_rating * 0.4 + rscore * 0.6);
    console.log("model rating", rscore);
    console.log("final score", finalscore, typeof finalscore);
    setModalFinalRating(finalscore);
    setModalData(data!);
  };
  const submitRating = async () => {
    console.log(`Rating for footpath : ${userRating}`);
    console.log(modalData.id);
    const roadid = modalData.id;
    const updatedData = {
      user_rating: userRating,
    };
    //console.log(road);
    // Update the rating in Supabase
    const { data, error } = await supabase
      .from("location-footpath") // Replace with your actual table name
      .update(updatedData)
      .match({ id: roadid }); // Adjust this match condition based on your table structure

    if (error) {
      throw error; // Handle the error as needed
    }
    // Here you can handle what happens with the rating (e.g., update the database, etc.)
    setModalVisible1(false); // Close the modal after submitting the rating
    setExtraRatingAdded(true);
  };
  return (
    <SafeAreaView className="flex-1 bg-[#121212] p-5">
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size={100} color="#FFFFFF" />
          <Text className="text-white text-center text-2xl mb-2">Loading...</Text>
        </View>
      ) : ( <>
      <View className="h-[80%] w-full mb-2">
        <Text className="text-white text-center text-2xl mb-2">Map View</Text>
        <MapComponent
          roadData={roadData}
          selectedLocation={selectedLocation}
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
          <Text className="text-white text-center text-2xl font-JakartaBold">
            Check Status
          </Text>
        </TouchableOpacity>
      </View>
      {modalData && modalFinalRating != 0 && (
        <>
          <ReactNativeModal isVisible={showSuccessModal}>
            <View className="flex flex-col justify-center items-center bg-white px-7 py-9 rounded-2xl min-h-[300px]">
              <AntDesign name="earth" size={50} color="black" />
              <Text className="text-lg font-JakartaBold text-center mb-2 mt-4">
                Score of {modalAddress}:
              </Text>
              <Rating
                type="star"
                ratingCount={5}
                readonly={true}
                startingValue={modalFinalRating!}
                ratingColor="#FFD700"
                fractions={2}
                jumpValue={0.5}
                ratingBackgroundColor="#FFD700"
                ratingTextColor="#FFD700"
              />
              <Text className="text-base text-gray-400 font-JakartaBold text-center mt-2">
                The Footpath here is rated {modalFinalRating} out of 5 Stars.
              </Text>
              <Text
                className={`mt-2 mb-3 text-xl text-red-400 font-JakartaBold text-center ${
                  modalFinalRating < 2.5 ? "text-red-400" : "text-green-400"
                }`}
              >
                {modalFinalRating < 2.5
                  ? "Not Recommended to walk!"
                  : "Safe to walk!"}
              </Text>
              <CustomButton
                title="Rate Again"
                onPress={() => {
                  setModalVisible1(true);
                  setRateAgain(1);
                  setModalVisible(false);
                }}
              />
              <CustomButton
                title="Close"
                onPress={() => {
                  setShowSuccessModal(false);
                  setModalData(null);
                  setModalVisible(false);
                }}
                className="mt-5"
              />
            </View>
          </ReactNativeModal>
          {RateAgain === 1 && (
            <ReactNativeModal isVisible={modalVisible1}>
              <View className="flex flex-col justify-center items-center bg-white px-7 py-9 rounded-2xl min-h-[300px]">
                <Text className="text-lg font-JakartaBold text-center mb-2 mt-4">
                  Rate this Footpath
                </Text>
                <Rating
                  showRating
                  type="star"
                  ratingCount={5}
                  startingValue={userRating}
                  ratingColor="#FFD700"
                  onFinishRating={(rating: number) => setUserRating(rating)}
                />
                <CustomButton
                  title="Submit"
                  onPress={submitRating}
                  className="mt-5"
                />
                <CustomButton
                  title="Close"
                    onPress={() => {
                      setUserRating(0);
                      setModalVisible(false);
                      setModalVisible1(false);
                      setShowSuccessModal(false);
                    }}
                  className="mt-5"
                />
              </View>
            </ReactNativeModal>
          )}
        </>
      )}
      {extraRatingAdded && (
        <Dialog isVisible={true}>
          <Dialog.Title title="Thank you!" />
          <Text className="text-center text-lg font-JakartaBold">
            Your rating has been submitted.
          </Text>
          <Text
            style={{
              color: 'blue',
              textAlign: 'right'
            }}
            onPress={() => {
              setExtraRatingAdded(false);
              setModalVisible1(false);
              setUserRating(0);
              setModalVisible(false);
              setShowSuccessModal(false);
              setReloadmap(true);
            }}
          >
            Close
          </Text>
        </Dialog>
      )}
      </>
    )}
    </SafeAreaView>
  );
};

export default Home;
