declare module 'react-map-gl' {
  import * as React from 'react';
  import { Map as MapboxMap } from 'mapbox-gl';

  export interface MapRef {
    getMap(): MapboxMap;
  }

  export interface ViewState {
    longitude: number;
    latitude: number;
    zoom: number;
    pitch?: number;
    bearing?: number;
  }

  export interface MapProps {
    ref?: React.RefObject<any>;
    mapboxAccessToken: string;
    mapStyle?: string;
    attributionControl?: boolean;
    onMove?: (evt: { viewState: any }) => void;
    children?: React.ReactNode;
    [key: string]: any;
  }

  export interface PopupProps {
    longitude: number;
    latitude: number;
    anchor?: string;
    closeButton?: boolean;
    closeOnClick?: boolean;
    onClose?: () => void;
    className?: string;
    children?: React.ReactNode;
  }

  export interface NavigationControlProps {
    position?: string;
  }

  export const Map: React.FC<MapProps>;
  export const Popup: React.FC<PopupProps>;
  export const NavigationControl: React.FC<NavigationControlProps>;
} 