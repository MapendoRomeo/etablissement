// src/api/authService.ts
import axios from "axios";

interface LoginData {
  email: string;
  password: string;
}

export const loginUser = async ({ email, password }: LoginData) => {
  try {
    const response = await axios.post("http://localhost:5000/auth/login", {
      email,
      password,
    });

    // On retourne le token ou les données utilisateur du backend
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Erreur de connexion");
  }
};
