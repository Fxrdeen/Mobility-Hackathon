import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, View } from "react-native";
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";
// Define a type for coordinates (latitude, longitude)
import * as Location from "expo-location";

type Coordinate = {
  latitude: number;
  longitude: number;
};

// Define a type for road data, which contains coordinates and a score
type Road = {
  coordinates: Coordinate[];
  score: number;
};

interface MapComponentProps {
  roadData: Road[];
}
const MapComponent: React.FC<MapComponentProps> = ({ roadData }) => {
  // Function to get road color based on the score
  const getRoadColor = (score: number): string => {
    // Normalize the score between 0 (green) and 100 (red)
    if (score <= 50) {
      const greenValue = Math.floor((score / 50) * 255); // From green to yellow
      return `rgb(255, ${greenValue}, 0)`;
    } else {
      const redValue = Math.floor(((100 - score) / 50) * 255); // From yellow to red
      return `rgb(${redValue}, 255, 0)`;
    }
  };
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Location permission is required to show your location."
        );
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: location.coords.latitude!,
        longitude: location.coords.longitude!,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
  return (
    <MapView
      provider={PROVIDER_GOOGLE}
      style={{ flex: 1 }}
      initialRegion={{
        latitude: location.latitude!,
        longitude: location.longitude!,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }}
      showsUserLocation={true}
    >
      {roadData.map((road: Road, index: number) => (
        <Polyline
          key={index}
          coordinates={road.coordinates}
          strokeColor={getRoadColor(road.score)}
          strokeWidth={6}
        />
      ))}
    </MapView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
export default MapComponent;
