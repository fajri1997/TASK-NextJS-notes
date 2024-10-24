"use server";
import { revalidatePath } from "next/cache";
import { baseUrl, getHeaders } from "./config";
import { redirect } from "next/navigation"; // Correct import for redirects
import { deleteToken, setToken } from "@/lib/token";

export async function login(formData) {
  const userData = Object.fromEntries(formData);

  const response = await fetch(`${baseUrl}/auth/login`, {
    method: "POST",
    headers: await getHeaders(),
    body: JSON.stringify(userData),
  });

  // Extract and store the token
  try {
    const { token } = await response.json();
    await setToken(token);
  } catch (error) {
    console.error(error); // "Unauthorized"
  }

  // Redirect to the `/notes` page
  redirect("/notes"); // Correct usage of redirect
}

export async function register(formData) {
  const response = await fetch(`${baseUrl}/auth/register`, {
    method: "POST",
    body: formData,
  });

  // Assuming token extraction and storage happens here
  const { token } = await response.json();
  await setToken(token);
  revalidatePath("/users");

  // Redirect to the `/notes` page
  redirect("/notes"); // Correct usage of redirect
}

export async function logout() {
  // Perform logout actions such as deleting the token
  await deleteToken();

  // Redirect the user to the homepage
  redirect("/"); // Correct usage of redirect
}

export async function getAllUsers() {
  const response = await fetch(`${baseUrl}/auth/users`);
  const users = await response.json();
  return users;
}
