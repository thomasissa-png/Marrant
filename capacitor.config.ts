import type { CapacitorConfig } from "@capacitor/cli";

const isDev = process.env.CAP_ENV === "dev";

const config: CapacitorConfig = {
  appId: "fr.deviensmarrant.app",
  appName: "Deviens Marrant",
  webDir: "apps/web/out",
  bundledWebRuntime: false,

  // En dev : live reload depuis le site distant. En prod : bundle local statique.
  server: isDev
    ? {
        url: "https://deviens-marrant.fr",
        cleartext: false,
      }
    : {
        androidScheme: "https",
        iosScheme: "capacitor",
        // En prod, l'app sert le bundle local depuis webDir
      },

  ios: {
    contentInset: "always",
    backgroundColor: "#0F0817", // fond sombre cohérent splash
    scheme: "deviensmarrant", // Universal links / deep linking
    limitsNavigationsToAppBoundDomains: false,
  },

  android: {
    backgroundColor: "#0F0817",
    allowMixedContent: false,
    captureInput: true,
    webContentsDebuggingEnabled: isDev,
  },

  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      launchFadeOutDuration: 200,
      backgroundColor: "#8B5CF6", // violet brand
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: false,
      splashImmersive: false,
      splashFullScreen: true,
    },
    StatusBar: {
      style: "DARK",
      backgroundColor: "#0F0817",
      overlaysWebView: false,
    },
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"],
    },
    App: {
      // Deep links : intent filters Android + URL schemes iOS configurés en natif
    },
  },
};

export default config;
