export const getEnvVariables = () => {
  return {
    API_URL: import.meta.env.VITE_API_URL,
    ASSISTANT_API_URL: import.meta.env.VITE_ASSISTANT_API_URL,
  }
}