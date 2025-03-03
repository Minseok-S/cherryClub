export const verifyToken = async (token: string) => {
  const response = await fetch("/api/auth/verifyToken", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token }),
  });
  return response.json();
};
