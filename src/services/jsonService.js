const JSON_URL = "http://localhost:3001";

// JSON Server se donors ki list uthane ke liye fallback function [cite: 45]
export const fetchJsonDonors = async () => {
  try {
    const response = await fetch(`${JSON_URL}/donors`);
    if (!response.ok) {
      throw new Error("JSON Server response issue");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("JSON Server Fetch error:", error.message);
    return []; // Empty list return karega agar local server band ho
  }
};

// Check karne ke liye ke data firestore se lena hai ya json server se
export const getDonorsWithFallback = async () => {
  try {
    // Pehle live Firebase try karo
    const liveData = await getDonorsBackend();
    return liveData;
  } catch (error) {
    console.log("Firebase down! JSON Server fallback active...");
    // Agar internet nahi hai ya firebase block hai, toh local file se uthao [cite: 44, 45]
    const localData = await fetchJsonDonors();
    return localData;
  }
};
import { getDonorsBackend } from "./firebaseService";