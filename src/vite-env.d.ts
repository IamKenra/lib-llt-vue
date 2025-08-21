/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_APP_NAME: string
  readonly VITE_APP_VERSION: string
  readonly VITE_DEV_PORT: string
  readonly VITE_JWT_TOKEN_KEY: string
  readonly VITE_JWT_REFRESH_KEY: string
  readonly VITE_DEFAULT_LANGUAGE: string
  readonly VITE_TIMEZONE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}