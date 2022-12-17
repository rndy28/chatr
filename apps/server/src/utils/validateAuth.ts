export function validateAuth(username: string, password: string) {
  if (!username) return { field: "username", message: "username is required" };

  if (username.length < 3)
    return {
      field: "username",
      message: "username at least have 3+ characters",
    };

  if (!password) return { field: "password", message: "password is required" };

  if (password.length < 3)
    return {
      field: "password",
      message: "password must at least have 3+ characters",
    };
}
