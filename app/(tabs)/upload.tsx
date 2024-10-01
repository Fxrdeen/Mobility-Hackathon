import { useState, useCallback } from "react";
import {
  StyleSheet,
  Image,
  Text,
  View,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { Dialog, Button } from "@rneui/themed";
import { router, useNavigation } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import { supabase } from "@/supabase";
import useStore from "@/store";
import MapView, { Marker } from "react-native-maps";
import AntDesign from "@expo/vector-icons/AntDesign";
import { ActivityIndicator } from "react-native";
import { CheckBox } from "@rneui/themed";
import DocumentScanner from "react-native-document-scanner-plugin";
import { Rating, AirbnbRating } from "react-native-ratings";
const Upload = () => {
  const [scannedImage, setScannedImage] = useState<string | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [reviewResult, setReviewResult] = useState<string | null>(null);
  const slatitude = useStore((state) => state.latitude);
  const slongitude = useStore((state) => state.longitude);
  const [procDone, setProcDone] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [name, setName] = useState<string | null>(null);
  const [checked1, setChecked1] = useState<boolean | null>(false);
  const [checked2, setChecked2] = useState<boolean | null>(false);
  const [slider, setSlider] = useState<boolean | null>(false);
  const [endPoint, setEndPoint] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [locdone, setLocDone] = useState<boolean>(false);
  const [imgdone, setImgDone] = useState<boolean>(false);
  const [rating, setRating] = useState<number>(0);
  const nav = useNavigation();
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: undefined,
      minCropBoxWidth: 10,
      minCropBoxHeight: 100,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      const res = result.assets[0].uri;
      const fileName = res.split("/").pop();
      setImage(result.assets[0].uri);
      setName(fileName!);
      setIsLoading(true);
    }
    setImgDone(true);
  };
  const getReview = async () => {
    setIsLoading(false);
    console.log("endPoint: ", endPoint);
    if (!image && !scannedImage) {
      alert("Please select a image first");
      setIsLoading(true);
      setIsSubmitting(false);

      return;
    }
    if (image && scannedImage) {
      alert("Please select one image");
      setIsLoading(true);
      setIsSubmitting(false);
      return;
    }
    if (!endPoint) {
      alert("Please select an end point first");
      setIsLoading(true);
      setIsSubmitting(false);
      return;
    }
    if (image) {
      fileUri = image;
    } else {
      fileUri = scannedImage;
    }
    setIsSubmitting(true);
    const fileInfo = await FileSystem.getInfoAsync(fileUri);
    if (!fileInfo.exists) {
      alert("File does not exist");
      setIsLoading(true);
      setImgDone(false);
      setIsSubmitting(false);
      return;
    }
    const formData = new FormData();
    if (image) {
      formData.append("image", {
        uri: image,
        type: "image/jpeg",
        name: "image.jpg",
      } as any);
    } else if (scannedImage) {
      formData.append("image", {
        uri: scannedImage,
        type: "image/jpeg",
        name: "image.jpg",
      } as any);
    }
    formData.append("electric", checked1 ? "true" : "false");
    formData.append("openDrain", checked2 ? "true" : "false");
    try {
      const response = await fetch(
        "https://pf-api-d8pu.onrender.com/upload-image",
        {
          method: "POST",
          body: formData,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Server error:", errorData);
        alert("Error uploading image: " + errorData.Error);
        setIsSubmitting(false);
        return;
      }
      setIsLoading(false);
      const dat = await response.json();
      setReviewResult(dat.Percentage);

      const { data, error } = await supabase
        .from("location-footpath")
        .insert([
          {
            latitude: slatitude,
            longitude: slongitude,
            score: dat.Percentage,
            latitude_end: endPoint.latitude,
            longitude_end: endPoint.longitude,
            user_rating: rating,
          },
        ])
        .select();
      console.log("Score: ", dat.Percentage);
      console.log("data: ", data);
      if (error) {
        console.error("Error uploading image:", error);
        alert("Error uploading image");
        setIsLoading(true);
        return;
      }
      setIsSubmitting(false);
      setRefreshing(true);
      setIsSubmitting(false);
      setLocDone(false);
      setImage(null);
      setScannedImage(null);
      setChecked1(false);
      setChecked2(false);
      setRating(0);
      setName(null);
      setEndPoint(null);
      setReviewResult(null);
      setImgDone(false);
      setProcDone(true);
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Error uploading image");
    }
    setIsSubmitting(false);
  };

  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const handleMapPress = (event) => {
    setEndPoint(event.nativeEvent.coordinate);
  };
  const scanDocument = async () => {
    const { scannedImages } = await DocumentScanner.scanDocument();
    if (scannedImages!.length > 0) {
      setScannedImage(scannedImages[0]);
      const fName = scannedImages[0].split("/").pop();
      setName(fName);
      setIsLoading(true);
      setImgDone(true);
    }
  };
  const ratingCompleted = (rating) => {
    //console.log("Rating: "+rating);
    setRating(rating);
    setImgDone(true);
  };
  return (
    <SafeAreaView className="flex-1 bg-[#121212] p-5">
      {locdone == true && (
        <>
          <View className="mt-5 w-[95%] h-40 bg-gray-800 rounded-xl flex justify-center items-center self-center">
            {!name ? (
              <TouchableOpacity
                className="flex justify-center items-center gap-5"
                onPress={pickImage}
              >
                <Text className="text-lg font-bold text-white">
                  Pick a image from camera roll
                </Text>
                <AntDesign name="upload" size={24} color="white" />
              </TouchableOpacity>
            ) : (
              <>
                <Image
                  source={{ uri: image || scannedImage }}
                  style={{ width: 100, height: 100, marginTop: 10 }}
                />
                <Text className="mt-6 text-white text-xs font-bold">
                  {name}
                </Text>
              </>
            )}
          </View>
          <TouchableOpacity
            className="mt-5 h-10 flex justify-center items-center bg-gray-300 w-[95%] self-center text-center rounded-xl"
            onPress={scanDocument}
          >
            <Text className="text-center text-lg">Click a Picture!</Text>
          </TouchableOpacity>
          <View className="mt-5 rounded-xl">
            <CheckBox
              center
              title="Electric Hazard"
              checked={checked1!}
              style={{
                borderRadius: 10,
              }}
              onPress={() => setChecked1(!checked1)}
            />
            <CheckBox
              center
              title="Open Drains"
              checked={checked2!}
              style={{
                borderRadius: 10,
              }}
              onPress={() => setChecked2(!checked2)}
            />
            <Text className="text-white text-center text-lg font-bold">
              Rate the Footpath
            </Text>
            <Rating
              type="star"
              ratingCount={5}
              showRating={true}
              imageSize={30}
              ratingBackgroundColor="black"
              tintColor="black"
              startingValue={0}
              onFinishRating={ratingCompleted}
              style={{ paddingVertical: 10 }}
            />
          </View>
          <TouchableOpacity
            className="mt-5 h-10 flex justify-center items-center bg-gray-300 w-[95%] self-center text-center rounded-xl"
            onPress={getReview}
            disabled={isSubmitting}
          >
            <Text className="text-center text-lg">Submit</Text>
          </TouchableOpacity>
          {isSubmitting == true && (
            <ActivityIndicator size={60} color="#0000ff" className="mt-6" />
          )}
        </>
      )}
      {locdone == false && (
        <>
          <Text className="text-white text-center text-lg font-bold">
            Select a End Point {"\n"}
            <Text className="text-white text-center text-lg font-bold">
              Total Length should be 20 Meters
            </Text>
          </Text>
          <MapView
            provider={"google"}
            style={{ flex: 1, marginTop: 10 }}
            initialRegion={{
              latitude: slatitude,
              longitude: slongitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            minZoomLevel={18}
            showsUserLocation={true}
            onPress={handleMapPress}
          >
            <Marker
              coordinate={{ latitude: slatitude, longitude: slongitude }}
              image={require("@/assets/icons/spin.png")}
              title="Starting Point"
            />
            {endPoint && (
              <Marker
                coordinate={endPoint}
                image={require("@/assets/icons/epin.png")}
                title="End Point"
              />
            )}
          </MapView>
          <TouchableOpacity
            className="mt-5 h-10 flex justify-center items-center bg-gray-300 w-[95%] self-center text-center rounded-xl"
            onPress={() => {
              if (endPoint) {
                setLocDone(true);
              } else {
                alert("Please select an End Point");
              }
            }}
          >
            <Text className="text-center text-lg">Next</Text>
          </TouchableOpacity>
        </>
      )}
      
      {procDone && (
            <Dialog
              isVisible={procDone}
              onBackdropPress={() => {
                setProcDone(false);
                router.navigate("/(tabs)/home");
              }}
            >
              <Dialog.Title title="Success!" />
              <Text>Image with Score Uploaded Successfully!</Text>
              <Button 
                title="Close" 
                onPress={() => {
                  setProcDone(false);
                  router.navigate("/(tabs)/home");
                }} 
                buttonStyle={{ alignSelf: 'flex-end', width: 100, height: 40 }}
              /> 
        
        </Dialog>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

});

export default Upload;
