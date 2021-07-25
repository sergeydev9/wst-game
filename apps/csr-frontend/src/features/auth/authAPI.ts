import { BASE_URL } from "../../util/constants";

export interface LoginResponse {
  user: { id: string; email: string };
  token: string;
  message: "login";
}

//TODO: Rewrite all this with axios
const logIn = async (
  email: string,
  password: string
): Promise<Response> => {
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


  if (result.status !== 200) {
    const json = await result.json();

    if (json.message) {
      throw new Error(json.message);
    }
    throw new Error("An Unknown error occured during login");
  }

  return result;
};

export default logIn;
