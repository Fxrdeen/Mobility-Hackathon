import { useEffect, useState } from "react";
import { StyleSheet, Button, Image, Text, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { supabase } from "@/supabase";
import useStore from "@/store";
const Upload = () => {
  const [image, setImage] = useState<string | null>(null);
  const [reviewResult, setReviewResult] = useState<string | null>(null);
  const latitude = useStore((state) => state.latitude);
  const longitude = useStore((state) => state.longitude);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
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
    <SafeAreaView style={styles.container}>
      <Button title="Pick an image from camera roll" onPress={pickImage} />
      {image && <Image source={{ uri: image }} style={styles.image} />}
      <Button title="Submit" onPress={getReview} />
      <Text>{reviewResult}</Text>
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
