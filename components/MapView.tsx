import React from 'react';
import MapView, { Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
// Define a type for coordinates (latitude, longitude)
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

  return (
    <MapView
      provider={PROVIDER_GOOGLE} 
      style={{ flex: 1 }}
      initialRegion={{
        latitude: 12.9716, // Set an initial region (e.g., Bangalore)
        longitude: 77.5946,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }}
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

export default MapComponent;
