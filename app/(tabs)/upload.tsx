import { useEffect, useState } from "react";
import {
  StyleSheet,
  Button,
  Image,
  Text,
  Alert,
  View,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { supabase } from "@/supabase";
import useStore from "@/store";
import AntDesign from "@expo/vector-icons/AntDesign";
import { CheckBox } from "@rneui/themed";
import { Slider } from "@rneui/themed";
const Upload = () => {
  const [image, setImage] = useState<string | null>(null);
  const [reviewResult, setReviewResult] = useState<string | null>(null);
  const latitude = useStore((state) => state.latitude);
  const longitude = useStore((state) => state.longitude);
  const [name, setName] = useState<string | null>(null);
  const [checked1, setChecked1] = useState<boolean | null>(false);
  const [checked2, setChecked2] = useState<boolean | null>(false);
  const [slider, setSlider] = useState<boolean | null>(false);
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      const res = result.assets[0].uri;
      const fileName = res.split("/").pop();
      setImage(result.assets[0].uri);
      setName(fileName!);
    }
  };
  const getReview = async () => {
    if (!image) {
      alert("Please select a video first");
      return;
    }

    const fileInfo = await FileSystem.getInfoAsync(image);
    if (!fileInfo.exists) {
      alert("File does not exist");
      return;
    }
    const formData = new FormData();
    formData.append("image", {
      uri: image,
      type: "image/jpeg",
      name: "image.jpg",
    } as any);
    formData.append("electric", checked1 ? "true" : "false");
    formData.append("openDrain", checked2 ? "true" : "false");
    try {
      const response = await fetch("http://192.168.29.95:3000/upload-image", {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Server error:", errorData);
        alert("Error uploading video: " + errorData.Error);
        return;
      }

      const dat = await response.json();
      setReviewResult(dat.Percentage);

      const { data, error } = await supabase
        .from("location-footpath")
        .insert([
          { latitude: latitude, longitude: longitude, score: dat.Percentage },
        ])
        .select();
    } catch (error) {
      console.error("Error uploading video:", error);
      alert("Error uploading video");
    }
  };
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  return (
    <SafeAreaView className="flex-1 bg-[#121212] p-5">
      <View className="mt-5 w-[95%] h-40 bg-gray-800 rounded-xl flex justify-center items-center self-center">
        <TouchableOpacity
          className="flex justify-center items-center gap-5"
          onPress={pickImage}
        >
          <Text className="text-lg font-bold text-white">
            Pick a video from camera roll
          </Text>
          <AntDesign name="upload" size={24} color="white" />
        </TouchableOpacity>
        {name && (
          <Text className="mt-6 text-white text-xs font-bold">{name}</Text>
        )}
      </View>
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
        {/* <Slider minimumValue={0} maximumValue={5} value={slider} /> */}
      </View>
      <TouchableOpacity
        className="mt-5 h-10 flex justify-center items-center bg-gray-300 w-[95%] self-center text-center rounded-xl"
        onPress={getReview}
      >
        <Text className="text-center text-lg">Submit</Text>
      </TouchableOpacity>
      <Text className="text-white mt-10 text-center">{reviewResult}</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    width: 200,
    height: 200,
  },
});

export default Upload;
