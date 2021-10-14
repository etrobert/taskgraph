import {useEffect} from "../../_snowpack/pkg/react.js";
import {useSetRecoilState} from "../../_snowpack/pkg/recoil.js";
import {getAuth, onAuthStateChanged} from "../../_snowpack/pkg/firebase/auth.js";
import {authState} from "../atoms.js";
const auth = getAuth();
const useSyncFirebaseAuth = () => {
  const setAuth = useSetRecoilState(authState);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => setAuth(user ? {status: "signedIn", userId: user.uid} : {status: "notSignedIn"}));
    return unsubscribe;
  }, [setAuth]);
};
export default useSyncFirebaseAuth;
