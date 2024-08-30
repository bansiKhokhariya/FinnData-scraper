import themes from "daisyui/src/theming/themes";
import { ConfigProps } from "./types/config";

const config = {
  // REQUIRED
  appName: "OTT Finder",
  // REQUIRED: a short description of your app for SEO tags (can be overwritten)
  appDescription:
    "Find your next favorite movie with our AI-powered recommendation tool! Our tool suggests personalized movies based on your unique tastes, saving you time and ensuring a perfect watch. Try it now!",
  // REQUIRED (no https://, not trialing slash at the end, just the naked domain)
  domainName: "ottfinder.hkapps.in",
} as ConfigProps;

export default config;