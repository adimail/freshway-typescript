import { Asset } from 'expo-asset';

// svg
import Logo from '../assets/images/logo.svg';

// Define types for your assets
type SvgAsset = typeof Logo; // Assuming Logo is the correct type for your SVG asset
type ImageAsset = string; // Assuming URLs or paths to PNG files

export const svgs: { [key: string]: SvgAsset } = {
  logo: Logo,
};

const images: { [key: string]: ImageAsset } = {
  logo_sm: require('../assets/images/logo-sm.png'),
  logo_lg: require('../assets/images/logo-lg.png'),
};

export const imageAssets = Object.keys(images).map((key) =>
  Asset.fromModule(images[key]).downloadAsync()
);
