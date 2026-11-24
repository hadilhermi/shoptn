import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

function getUsers() {
  return JSON.parse(localStorage.getItem("users") || "[]");
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
  }, [user]);

  function register({ name, email, password }) {
    const users = getUsers();
    if (users.some((u) => u.email === email)) {
      return { ok: false, error: "Cet email est déjà utilisé" };
    }
    const newUser = { id: Date.now(), name, email, password };
    localStorage.setItem("users", JSON.stringify([...users, newUser]));
    // Ma nekhzenouch el password fel session
    setUser({ id: newUser.id, name, email });
    return { ok: true };
  }

  function login({ email, password }) {
    const found = getUsers().find(
      (u) => u.email === email && u.password === password
    );
    if (!found) return { ok: false, error: "Email ou mot de passe incorrect" };
    setUser({ id: found.id, name: found.name, email: found.email });
    return { ok: true };
  }

  function logout() {
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Context modules intentionally export both a provider component and its hook.
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext);
}