"use client";
import { useEffect, useRef, useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

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
}

interface MapComponentProps {
  buildings: Building[];
}

// Define GeoJSON feature types for TypeScript
interface GeoJSONFeature {
  type: string;
  geometry: {
    type: string;
    coordinates: number[];
  };
  properties: any;
}

interface MapboxEvent {
  features?: GeoJSONFeature[];
  [key: string]: any;
}

const MapComponent = ({ buildings }: MapComponentProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [popupInfo, setPopupInfo] = useState<Building | null>(null);
  const [popupCoordinates, setPopupCoordinates] = useState<[number, number] | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);

  // Initialize map only once
  useEffect(() => {
    console.log("Map component mounting");
    if (!mapContainer.current) {
      console.log("Map container ref is null");
      return;
    }
    
    // Check if map is already initialized
    if (map.current) return;
    
    try {
      console.log("Initializing map...");
      // Use a simpler map style to ensure it loads
      mapboxgl.accessToken = 'pk.eyJ1IjoiYXRoYXJ2YWxhZGUiLCJhIjoiY203azliYXBmMGYxbjJqcHJucHltamx1MSJ9.MIDkONe-6BnGL4vlCqCBjw';
      
      const mapInstance = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11', // Use light style for better 3D visibility
        center: [-73.9857, 40.7484],
        zoom: 16,
        pitch: 60, // Higher pitch for better 3D view
        bearing: -17.6,
        antialias: true
      });
      
      console.log("Map instance created");
      map.current = mapInstance;
      
      // Add basic error handling
      mapInstance.on('error', (e) => {
        console.error('Mapbox error:', e);
        setMapError('Failed to load map: ' + (e.error?.message || 'Unknown error'));
      });
      
      // Log when map is loaded
      mapInstance.on('load', () => {
        console.log("Map loaded successfully");
        setMapLoaded(true);
        
        // Immediately add 3D buildings after map loads
        try {
          // Create placeholder data for Empire State Building
          const empireStateBuilding = {
            id: 1,
            name: "Empire State Building",
            coordinates: [-73.9857, 40.7484] as [number, number],
            height: 381,
            pricePerSqFt: 582.24,
            availableSqFt: 15000,
            airRightsVolume: 250000,
            viewProtected: true
          };
          
          // Create a GeoJSON polygon for the Empire State Building footprint
          const buildingFootprint: GeoJSON.Feature = {
            type: 'Feature',
            geometry: {
              type: 'Polygon',
              coordinates: [[
                [-73.9865, 40.7478],
                [-73.9865, 40.7490],
                [-73.9849, 40.7490],
                [-73.9849, 40.7478],
                [-73.9865, 40.7478]
              ]]
            },
            properties: empireStateBuilding
          };
          
          // Add source for the building footprint
          mapInstance.addSource('empire-state-building', {
            type: 'geojson',
            data: buildingFootprint
          });
          
          // Add 3D building extrusion
          mapInstance.addLayer({
            'id': 'empire-state-building-3d',
            'source': 'empire-state-building',
            'type': 'fill-extrusion',
            'paint': {
              'fill-extrusion-color': '#1a2030',
              'fill-extrusion-height': empireStateBuilding.height,
              'fill-extrusion-base': 0,
              'fill-extrusion-opacity': 0.9
            }
          });
          
          // Add air rights volume visualization
          mapInstance.addLayer({
            'id': 'air-rights-volume',
            'source': 'empire-state-building',
            'type': 'fill-extrusion',
            'paint': {
              'fill-extrusion-color': '#4CAF50',
              'fill-extrusion-height': empireStateBuilding.height + empireStateBuilding.airRightsVolume/100,
              'fill-extrusion-base': empireStateBuilding.height,
              'fill-extrusion-opacity': 0.4
            }
          });
          
          // Add a marker for the building
          mapInstance.addSource('building-point', {
            type: 'geojson',
            data: {
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: empireStateBuilding.coordinates
              },
              properties: empireStateBuilding
            } as GeoJSON.Feature
          });
          
          mapInstance.addLayer({
            id: 'building-marker',
            type: 'circle',
            source: 'building-point',
            paint: {
              'circle-radius': 8,
              'circle-color': '#4CAF50',
              'circle-opacity': 0.9,
              'circle-stroke-width': 2,
              'circle-stroke-color': '#fff'
            }
          });
          
          // Add hover effect
          mapInstance.on('mousemove', 'building-marker', (e: mapboxgl.MapMouseEvent & { features?: mapboxgl.MapboxGeoJSONFeature[] }) => {
            if (e.features && e.features.length > 0) {
              const feature = e.features[0];
              if (feature.properties) {
                mapInstance.getCanvas().style.cursor = 'pointer';
                setPopupInfo(feature.properties as Building);
                setPopupCoordinates(empireStateBuilding.coordinates);
                
                // Highlight air rights
                mapInstance.setPaintProperty('air-rights-volume', 'fill-extrusion-opacity', 0.7);
              }
            }
          });
          
          mapInstance.on('mouseleave', 'building-marker', () => {
            mapInstance.getCanvas().style.cursor = '';
            setPopupInfo(null);
            setPopupCoordinates(null);
            mapInstance.setPaintProperty('air-rights-volume', 'fill-extrusion-opacity', 0.4);
          });
          
          // Add navigation control
          mapInstance.addControl(new mapboxgl.NavigationControl(), 'bottom-right');
        } catch (err) {
          console.error('Error adding 3D buildings:', err);
        }
      });
      
      return () => {
        console.log("Cleaning up map");
        if (map.current) {
          map.current.remove();
          map.current = null;
        }
      };
    } catch (err) {
      console.error('Error initializing map:', err);
      setMapError('Error initializing map: ' + (err as Error).message);
    }
  }, []); // Empty dependency array - only run once

  // Safe access to map.project
  const getProjectedCoordinates = (coordinates: [number, number]) => {
    if (!map.current) return { x: 0, y: 0 };
    try {
      return map.current.project(coordinates);
    } catch (err) {
      console.error('Error projecting coordinates:', err);
      return { x: 0, y: 0 };
    }
  };

  return (
    <div className="relative w-full h-[500px] rounded-xl overflow-hidden shadow-2xl bg-gray-900">
      <div ref={mapContainer} className="absolute inset-0" style={{ width: '100%', height: '100%' }} />
      
      {!mapLoaded && !mapError && (
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
      
      {/* Custom popup */}
      {popupInfo && popupCoordinates && mapLoaded && (
        <div 
          className="absolute z-10 transform -translate-x-1/2 -translate-y-full pointer-events-none"
          style={{
            left: getProjectedCoordinates(popupCoordinates).x,
            top: getProjectedCoordinates(popupCoordinates).y - 15
          }}
        >
          <div className="p-3 bg-darkmode/90 backdrop-blur-md border border-primary/30 rounded-lg shadow-glow-sm max-w-xs">
            <h3 className="text-white text-lg font-medium">{popupInfo.name}</h3>
            <p className="text-primary text-xl font-bold">${popupInfo.pricePerSqFt}/sq.ft</p>
            <div className="mt-2 grid grid-cols-2 gap-2 text-sm text-white">
              <div>
                <span className="text-muted">Height:</span>
                <span className="ml-1">{popupInfo.height}m</span>
              </div>
              <div>
                <span className="text-muted">Available:</span>
                <span className="ml-1">{popupInfo.availableSqFt} sq.ft</span>
              </div>
              <div className="col-span-2">
                <span className="text-muted">Status:</span>
                <span className={`ml-1 ${popupInfo.viewProtected ? 'text-green-400' : 'text-orange-400'}`}>
                  {popupInfo.viewProtected ? 'View Protected' : 'Unprotected View'}
                </span>
              </div>
            </div>
            <button className="mt-3 bg-primary text-darkmode px-4 py-2 rounded-lg text-sm w-full font-medium hover:bg-primary/90 transition-colors pointer-events-auto">
              Buy Air Rights
            </button>
          </div>
          <div className="w-4 h-4 bg-darkmode/90 transform rotate-45 mx-auto -mt-2 border-r border-b border-primary/30"></div>
        </div>
      )}
      
      {/* Overlay elements */}
      <div className="absolute top-4 left-4 bg-primary/20 backdrop-blur-sm p-3 rounded-lg border border-primary/30 text-white text-sm">
        <span className="flex items-center">
          <Icon icon="ph:info-bold" className="mr-2" /> Hover over buildings to see air rights details
        </span>
      </div>
      
      <div className="absolute bottom-4 left-4 flex gap-3">
        <div className="bg-primary/20 backdrop-blur-sm p-2 rounded-lg border border-primary/30 text-white text-sm flex items-center">
          <div className="w-3 h-3 rounded-full bg-green-400 mr-2"></div>
          <span>Protected View</span>
        </div>
        <div className="bg-primary/20 backdrop-blur-sm p-2 rounded-lg border border-primary/30 text-white text-sm flex items-center">
          <div className="w-3 h-3 rounded-full bg-orange-400 mr-2"></div>
          <span>Unprotected View</span>
        </div>
      </div>
    </div>
  );
};

export default MapComponent; 