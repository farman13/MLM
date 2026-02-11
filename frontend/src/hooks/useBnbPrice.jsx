import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE } from "../lib/utils";

export default function useBnbPrice(refreshInterval = 30000) {
    const [bnbPrice, setBnbPrice] = useState(null);
    const [loadingPrice, setLoadingPrice] = useState(false);
    const [error, setError] = useState("");

    const fetchBnbPrice = async () => {
        try {
            setLoadingPrice(true);
            setError("");

            const res = await axios.get(`${API_BASE}/price/bnb`, {
                timeout: 15000,
            });

            setBnbPrice(res.data.data.price);
            console.log("Fetched BNB Price:", res.data.data.price);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch BNB price");
            setBnbPrice(null);
        } finally {
            setLoadingPrice(false);
        }
    };

    useEffect(() => {
        fetchBnbPrice();

        if (!refreshInterval) return;

        const interval = setInterval(() => {
            fetchBnbPrice();
        }, refreshInterval);

        return () => clearInterval(interval);
    }, [refreshInterval]);

    return { bnbPrice, loadingPrice, error, refetch: fetchBnbPrice };
}
