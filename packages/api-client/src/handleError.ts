import axios from "axios";

export const handleError = (error: unknown): never => {
  if (axios.isAxiosError(error)) {
    const msg = error.response?.data?.message || error.message;
    console.log("API Error:", error);
    
    throw new Error(msg || "Something went wrong while making the request.");
  }
  throw error instanceof Error ? error : new Error("An unexpected error occurred.");
};