export const AuthApiUrl = `${process.env.NEXT_PUBLIC_API_URL}`;

export const userLogin = (payload) => {
  return fetch(`${AuthApiUrl}/login`, {
    method: "POST",
    headers : {
        "Content-Type": "application/json",
    },
    body : JSON.stringify(payload)
  });
};

export const userRegister = (payload) => {
  return fetch(`${AuthApiUrl}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
};