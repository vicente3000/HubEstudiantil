import { http } from "../../services/http.js";

export async function fetchApiOverview() {
  const { data } = await http.get("/");
  return data;
}

export async function fetchHealth() {
  const { data } = await http.get("/health", {
    validateStatus: () => true
  });
  return data;
}
