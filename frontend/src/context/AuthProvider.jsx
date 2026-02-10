import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useAccount, useSignMessage } from "wagmi";
import axios from "axios";
import { API_BASE } from "../lib/utils";


const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }) {
    const { address, isConnected } = useAccount();
    const { signMessageAsync } = useSignMessage();

    const [token, setToken] = useState(localStorage.getItem("token") || "");
    const [authLoading, setAuthLoading] = useState(false);

    const loginCalledRef = useRef(false);

    // ✅ manual set token function (used after register)
    const setAuthToken = (jwtToken) => {
        localStorage.setItem("token", jwtToken);
        setToken(jwtToken);
    };

    const logout = () => {
        localStorage.removeItem("token");
        setToken("");
        loginCalledRef.current = false;
    };

    const loginWithWallet = async () => {
        try {
            if (!address) return;

            setAuthLoading(true);

            // 1) get nonce message
            const nonceRes = await axios.get(`${API_BASE}/auth/nonce/${address}`);
            const message = nonceRes.data.data.message;

            // 2) sign message
            const signature = await signMessageAsync({ message });

            // 3) verify
            const verifyRes = await axios.post(`${API_BASE}/auth/verify`, {
                walletAddress: address,
                message,
                signature,
            });

            const jwtToken = verifyRes.data.data.token;

            setAuthToken(jwtToken);
        } catch (err) {
            console.log("Auth error:", err);
            logout();
        } finally {
            setAuthLoading(false);
        }
    };

    useEffect(() => {
        if (!isConnected || !address) {
            logout();
            return;
        }

        const savedToken = localStorage.getItem("token");

        if (savedToken) {
            setToken(savedToken);
            return;
        }

        if (!loginCalledRef.current) {
            loginCalledRef.current = true;
            loginWithWallet();
        }
    }, [isConnected, address]);

    return (
        <AuthContext.Provider
            value={{
                token,
                authLoading,
                loginWithWallet,
                setAuthToken,   // ✅ added
                logout,         // ✅ added
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
