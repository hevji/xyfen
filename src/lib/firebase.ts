export interface FirebaseUser {
  email: string;
  uid: string;
}

const mockUsers: Record<string, string> = {};

export const signInWithEmail = async (email: string, password: string) => {
  const storedPassword = localStorage.getItem(`user_${email}`);
  if (!storedPassword || storedPassword !== password) {
    throw new Error("Invalid email or password");
  }
  const user: FirebaseUser = { email, uid: email };
  return { user };
};

export const registerWithEmail = async (email: string, password: string) => {
  if (localStorage.getItem(`user_${email}`)) {
    throw new Error("Email already in use");
  }
  localStorage.setItem(`user_${email}`, password);
  const user: FirebaseUser = { email, uid: email };
  return { user };
};

export const logout = async () => {
  sessionStorage.removeItem("xyfen_authenticated");
};

let authCallback: ((user: FirebaseUser | null) => void) | null = null;

export const onAuthStateChanged = (callback: (user: FirebaseUser | null) => void) => {
  authCallback = callback;
  const isAuthenticated =
    sessionStorage.getItem("xyfen_authenticated") === "true" ||
    localStorage.getItem("xyfen_authenticated") === "true";
  if (isAuthenticated) {
    const email = localStorage.getItem("xyfen_user_email");
    if (email) {
      callback({ email, uid: email });
    }
  } else {
    callback(null);
  }
  return () => {
    authCallback = null;
  };
};

export const initializeFirebase = () => {
  return null;
};
