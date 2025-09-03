declare module 'react-native-config' {
  export interface NativeConfig {
    AZURE_SUBSCRIPTION_KEY?: string;
    // Add all your .env variables here
    [name: string]: string | undefined;
  }

  export const Config: NativeConfig;
  export default Config;
}