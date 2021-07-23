import { BASE_URL } from "../../util/constants";

export interface LoginResponse {
  user: { id: string; email: string };
  token: string;
  message: "login";
}

const logIn = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  const result = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  const json = await result.json();

  if (result.status !== 200) {
    if (json.message) {
      throw new Error(json.message);
    }
    throw new Error("An Unknown error occured during login");
  }

  return json;
};

export default logIn;
