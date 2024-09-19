import { useState } from "react";
import { StyleSheet, Button, Image, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
const Upload = () => {
  const [image, setImage] = useState<string | null>(null);
  const [reviewResult, setReviewResult] = useState<string | null>(null);
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
      const response = await fetch("http://127.0.0.1:5000/upload-image", {
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

      const data = await response.json();
      setReviewResult(data.Percentage);
    } catch (error) {
      console.error("Error uploading video:", error);
      alert("Error uploading video");
    }
  };
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
