import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "../firebase"; // Import Firestore database
import { doc, getDoc } from "firebase/firestore"; // Firestore methods

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        // Check if photoURL exists in Firebase Auth user
        if (!authUser.photoURL) {
          try {
            // Fetch user profile from Firestore
            const userDoc = await getDoc(doc(db, "users", authUser.uid));
            if (userDoc.exists()) {
              const userData = userDoc.data();
              // Merge Firestore data with Firebase Auth user
              const mergedUser = {
                ...authUser,
                photoURL: userData.photoURL || null, // Use Firestore photoURL if available
              };
              setUser(mergedUser);
            } else {
              setUser(authUser); // Use auth user if Firestore profile is missing
            }
          } catch (error) {
            console.error("Error fetching user from Firestore:", error);
            setUser(authUser); // Fallback to auth user
          }
        } else {
          setUser(authUser); // Use the Firebase Auth user directly if photoURL exists
        }
      } else {
        setUser(null);
      }
      setLoadingInitial(false);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const logout = () => {
    signOut(auth).then(() => {
      setUser(null);
    });
  };

  const memoedValue = useMemo(() => {
    return { user, setUser, loading, setLoading, logout };
  }, [user, loading]);

  return (
    <AuthContext.Provider value={memoedValue}>
      {!loadingInitial && children}
    </AuthContext.Provider>
  );
};

export default function useAuth() {
  return useContext(AuthContext);
}

// handy 
// last artist not shown