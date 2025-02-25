"use client";
import { useEffect, useRef, useState } from "react";
import { NFT } from "@/types/nft";
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Icon } from "@iconify/react/dist/iconify.js";

interface PropertyMapViewProps {
  nft: NFT;
}

// Define the building type
interface Building {
  id: number;
  name: string;
  coordinates: [number, number];
  height: number;
  pricePerSqFt: number;
  availableSqFt: number;
  airRightsVolume: number;
  viewProtected: boolean;
  row: number;
  footprint: [number, number][];
}

const PropertyMapView = ({ nft }: PropertyMapViewProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [coordinates, setCoordinates] = useState<[number, number] | null>(null);

  // Get property coordinates from address using Mapbox Geocoding API
  useEffect(() => {
    const geocodeAddress = async () => {
      try {
        // Use the NFT's latitude and longitude if available
        if (nft.latitude && nft.longitude) {
          setCoordinates([nft.longitude, nft.latitude]);
          return;
        }
        
        // Otherwise, geocode the address
        const address = encodeURIComponent(nft.property_address);
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${address}.json?access_token=pk.eyJ1IjoiYXRoYXJ2YWxhZGUiLCJhIjoiY203azliYXBmMGYxbjJqcHJucHltamx1MSJ9.MIDkONe-6BnGL4vlCqCBjw`
        );
        
        if (!response.ok) {
          throw new Error('Geocoding failed');
        }
        
        const data = await response.json();
        if (data.features && data.features.length > 0) {
          const [lng, lat] = data.features[0].center;
          setCoordinates([lng, lat]);
        } else {
          throw new Error('No location found for this address');
        }
      } catch (err) {
        console.error('Error geocoding address:', err);
        // Fallback to default coordinates based on property name
        const firstWord = nft.title.split(' ')[0].toLowerCase();
        switch (firstWord) {
          case 'niagara':
            setCoordinates([-79.0767, 43.0828]); // Niagara Falls
            break;
          case 'vancouver':
            setCoordinates([-123.1207, 49.2827]); // Vancouver
            break;
          case 'miami':
            setCoordinates([-80.1918, 25.7617]); // Miami
            break;
          case 'sydney':
            setCoordinates([151.2153, -33.8568]); // Sydney
            break;
          case 'dubai':
            setCoordinates([55.2708, 25.2048]); // Dubai
            break;
          default:
            setCoordinates([-79.0767, 43.0828]); // Default to Niagara Falls
        }
      }
    };
    
    geocodeAddress();
  }, [nft]);

  // Generate buildings data based on NFT info
  const generateBuildingsData = (nft: NFT, baseCoordinates: [number, number]): Building[] => {
    // Extract numeric values from strings
    const currentHeight = parseInt(nft.current_height.split(' ')[0]);
    const maxHeight = parseInt(nft.maximum_height.split(' ')[0]);
    const availableFloors = parseInt(nft.available_floors.split('-')[1].split(' ')[0]) - currentHeight;
    const price = parseInt(nft.price.replace(/,/g, ''));
    
    // Calculate if this is a first or second row building
    const isFirstRow = currentHeight < 20; // First row buildings are shorter
    
    // Create buildings array with main building and surrounding buildings
    return [
      // Main building (the one being listed)
      {
        id: 1,
        name: nft.title,
        coordinates: baseCoordinates,
        height: currentHeight * 3, // Convert floors to meters for visualization
        pricePerSqFt: price / 1000, // Simplified calculation
        availableSqFt: availableFloors * 1000, // Simplified calculation
        airRightsVolume: (maxHeight - currentHeight) * 3000, // Volume of potential air rights
        viewProtected: false, // The listing is for buying protection
        row: isFirstRow ? 1 : 2,
        footprint: [
          [baseCoordinates[0] - 0.0005, baseCoordinates[1] - 0.0005],
          [baseCoordinates[0] - 0.0005, baseCoordinates[1] + 0.0005],
          [baseCoordinates[0] + 0.0005, baseCoordinates[1] + 0.0005],
          [baseCoordinates[0] + 0.0005, baseCoordinates[1] - 0.0005],
          [baseCoordinates[0] - 0.0005, baseCoordinates[1] - 0.0005]
        ]
      },
      // Add some surrounding buildings for context
      {
        id: 2,
        name: "Adjacent Building 1",
        coordinates: [baseCoordinates[0] - 0.002, baseCoordinates[1] - 0.001],
        height: isFirstRow ? 40 : 20,
        pricePerSqFt: 450,
        availableSqFt: 8000,
        airRightsVolume: 60000,
        viewProtected: true,
        row: isFirstRow ? 2 : 1,
        footprint: [
          [baseCoordinates[0] - 0.0025, baseCoordinates[1] - 0.0015],
          [baseCoordinates[0] - 0.0025, baseCoordinates[1] - 0.0005],
          [baseCoordinates[0] - 0.0015, baseCoordinates[1] - 0.0005],
          [baseCoordinates[0] - 0.0015, baseCoordinates[1] - 0.0015],
          [baseCoordinates[0] - 0.0025, baseCoordinates[1] - 0.0015]
        ]
      },
      {
        id: 3,
        name: "Adjacent Building 2",
        coordinates: [baseCoordinates[0] + 0.002, baseCoordinates[1] + 0.001],
        height: isFirstRow ? 35 : 18,
        pricePerSqFt: 480,
        availableSqFt: 9000,
        airRightsVolume: 70000,
        viewProtected: false,
        row: isFirstRow ? 2 : 1,
        footprint: [
          [baseCoordinates[0] + 0.0015, baseCoordinates[1] + 0.0005],
          [baseCoordinates[0] + 0.0015, baseCoordinates[1] + 0.0015],
          [baseCoordinates[0] + 0.0025, baseCoordinates[1] + 0.0015],
          [baseCoordinates[0] + 0.0025, baseCoordinates[1] + 0.0005],
          [baseCoordinates[0] + 0.0015, baseCoordinates[1] + 0.0005]
        ]
      }
    ];
  };

  useEffect(() => {
    if (!mapContainer.current || !coordinates) return;
    if (map.current) return;
    
    try {
      mapboxgl.accessToken = 'pk.eyJ1IjoiYXRoYXJ2YWxhZGUiLCJhIjoiY203azliYXBmMGYxbjJqcHJucHltamx1MSJ9.MIDkONe-6BnGL4vlCqCBjw';
      
      const mapInstance = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/satellite-streets-v12',
        center: coordinates,
        zoom: 16,
        pitch: 60,
        bearing: 20,
        antialias: true
      });
      
      map.current = mapInstance;
      
      mapInstance.on('error', (e) => {
        console.error('Mapbox error:', e);
        setMapError('Failed to load map: ' + (e.error?.message || 'Unknown error'));
      });
      
      mapInstance.on('load', () => {
        setMapLoaded(true);
        
        try {
          const buildings = generateBuildingsData(nft, coordinates);
          
          // Add 3D buildings
          buildings.forEach((building, index) => {
            // Add the building footprint
            mapInstance.addSource(`building-${index}`, {
              'type': 'geojson',
              'data': {
                'type': 'Feature',
                'properties': {
                  'name': building.name,
                  'height': building.height,
                  'color': building.row === 1 ? '#f59e0b' : '#10b981',
                  'viewProtected': building.viewProtected
                },
                'geometry': {
                  'type': 'Polygon',
                  'coordinates': [building.footprint]
                }
              }
            });
            
            // Add the extrusion
            mapInstance.addLayer({
              'id': `building-3d-${index}`,
              'type': 'fill-extrusion',
              'source': `building-${index}`,
              'paint': {
                'fill-extrusion-color': building.row === 1 ? '#f59e0b' : '#10b981',
                'fill-extrusion-height': building.height,
                'fill-extrusion-base': 0,
                'fill-extrusion-opacity': building.id === 1 ? 0.8 : 0.6
              }
            });
          });
          
          // Add a marker for the exact address
          new mapboxgl.Marker({
            color: "#FF4D94"
          })
            .setLngLat(coordinates)
            .addTo(mapInstance);
          
          // Add navigation control
          mapInstance.addControl(new mapboxgl.NavigationControl(), 'bottom-right');
        } catch (err) {
          console.error('Error adding 3D buildings:', err);
        }
      });
      
      return () => {
        if (map.current) {
          map.current.remove();
          map.current = null;
        }
      };
    } catch (err) {
      console.error('Error initializing map:', err);
      setMapError('Error initializing map: ' + (err as Error).message);
    }
  }, [nft, coordinates]);

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden shadow-2xl bg-gray-900">
      <div ref={mapContainer} className="absolute inset-0" style={{ width: '100%', height: '100%' }} />
      
      {(!mapLoaded || !coordinates) && !mapError && (
        <div className="absolute inset-0 flex items-center justify-center bg-darkmode/50 z-10">
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading 3D Map...</p>
          </div>
        </div>
      )}
      
      {mapError && (
        <div className="absolute inset-0 flex items-center justify-center bg-darkmode/80 z-20">
          <div className="bg-red-900/50 p-4 rounded-lg text-white max-w-md text-center">
            <Icon icon="ph:warning-circle-fill" className="text-3xl mb-2 mx-auto" />
            <p>{mapError}</p>
            <p className="text-sm mt-2">Try refreshing the page or check your internet connection.</p>
          </div>
        </div>
      )}
      
      {/* Overlay with property info */}
      <div className="absolute bottom-4 left-4 bg-darkmode/70 backdrop-blur-sm p-3 rounded-lg border border-primary/30 text-white">
        <div className="flex items-center mb-1">
          <div className="w-3 h-3 rounded-full bg-orange-400 mr-2"></div>
          <span className="text-sm">First Row (Falls-facing)</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
          <span className="text-sm">Second Row</span>
        </div>
      </div>
      
      {/* Address overlay */}
      <div className="absolute top-4 left-4 bg-darkmode/70 backdrop-blur-sm p-3 rounded-lg border border-primary/30 text-white max-w-[80%]">
        <p className="text-sm font-medium">{nft.property_address}</p>
      </div>
    </div>
  );
};

export default PropertyMapView; 