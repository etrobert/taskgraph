import { useEffect } from "react";
import { useSetRecoilState } from "recoil";
import { getAuth, onAuthStateChanged } from "firebase/auth";

import { authState } from "@/atoms";

const auth = getAuth();

const useSyncFirebaseAuth = (): void => {
  const setAuth = useSetRecoilState(authState);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) =>
      setAuth(
        user
          ? { status: "signedIn", userId: user.uid }
          : { status: "notSignedIn" }
      )
    );

    return unsubscribe;
  }, [setAuth]);
};

export default useSyncFirebaseAuth;
