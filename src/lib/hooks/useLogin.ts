import firebase from "firebase/compat/app";
import { useState, useEffect } from "react";

import { auth } from "../firebase";

interface User {
  email: string | null;
  displayName?: string | null;
  photoURL?: string | null;
  uid?: string | null;
}

export const useLogin = (): [
  User | null,
  boolean,
  () => void,
  () => Promise<void>
] => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (authUser) => {
      if (authUser) {
        const { email, displayName, photoURL, uid } = authUser;
        localStorage.setItem(
          "user",
          JSON.stringify({ email, displayName, photoURL, uid })
        );
        setUser({ email, displayName, photoURL, uid });
      } else {
        localStorage.removeItem("user");
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  };

  const signOut = () => {
    return auth.signOut();
  };

  return [user, loading, signIn, signOut];
};
