// src/hooks/useUserInfo.js
import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE } from "../lib/utils";

export default function useUserInfo(address) {
    const [userInfo, setUserInfo] = useState(null);
    const [loadingUserInfo, setLoadingUserInfo] = useState(false);

    const fetchUserInfo = async () => {
        try {
            if (!address) return;

            setLoadingUserInfo(true);

            const res = await axios.get(`${API_BASE}/mlm/user-info/${address}`);

            setUserInfo(res.data?.data || null);
        } catch (err) {
            setUserInfo(null);
        } finally {
            setLoadingUserInfo(false);
        }
    };

    useEffect(() => {
        if (address) fetchUserInfo();
    }, [address]);

    return { userInfo, loadingUserInfo, refetchUserInfo: fetchUserInfo };
}
