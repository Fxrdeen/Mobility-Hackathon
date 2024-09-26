import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, View } from "react-native";
import MapView, { Marker, Polyline, PROVIDER_GOOGLE, Polygon } from "react-native-maps";
// Define a type for coordinates (latitude, longitude)
import * as Location from "expo-location";
import useStore from "@/store";

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
  onMarkerPress: (road: Road) => void;

}
const MapComponent: React.FC<MapComponentProps> = ({ roadData, onMarkerPress }) => {
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
  const setLatitude = useStore((state:any) => state.setLatitude);
  const Lat=useStore((state:any)=>state.Lat);
  const Lng=useStore((state:any)=>state.Lng);
  const latitude = useStore((state:any) => state.latitude);
  const longitude = useStore((state:any) => state.longitude);
  const setLongitude = useStore((state:any) => state.setLongitude);
  const initialRegion = {
    latitude: Lat!,
    longitude: Lng!,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

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
      setLatitude(location.coords.latitude!);
      setLongitude(location.coords.longitude!);
      setLoading(false);
    })();
  }, []);

  const handlePolygonPress = (road: Road) => {
    console.log("road", road);
    onMarkerPress(road);
  };


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
      region={{
        latitude: Lat!,
        longitude: Lng!,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }}
      showsUserLocation={true}
    >
      {roadData.map((road: Road, index: number) => (
        <Polyline
          key={index}
          tappable={true}
          coordinates={road.coordinates}
          strokeColor={getRoadColor(road.score)}
          strokeWidth={6}
          onPress={() => handlePolygonPress(road)}
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
