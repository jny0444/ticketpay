declare namespace NodeJS {
  export interface ProcessEnv {
    NEXT_PUBLIC_APP_ID: string;
    NEXT_PUBLIC_APP_SECRET: string;
    NEXT_PUBLIC_PROVIDER_ID: string;
    PINATA_JWT: string;
    NEXT_PUBLIC_GATEWAY_URL: string;
  }
}
