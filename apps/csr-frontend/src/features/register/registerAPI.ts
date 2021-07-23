import { BASE_URL } from "../../util/constants";

const register = async (email: string, password: string) => {
  const result = await fetch(`${BASE_URL}/signup`, {
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

  if (result.status !== 201) {
    const json = await result.json();

    if (json.message) {
      throw new Error(json.message);
    }
    throw new Error("An Unknown error occured during registration");
  }
};

export default register;
