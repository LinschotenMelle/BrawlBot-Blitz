import { useEffect, useState } from "react";
import { getAuthStatus } from "../api";
import { User } from "../types";

export function useFetchUser() {
  const [user, setUser] = useState<User>();
  const [err, setErr] = useState<string>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getAuthStatus()
      .then(({ data }) => setUser(data))
      .catch((err) => setErr(err))
      .finally(() => {
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      });
  }, []);

  return { user, err, loading };
}
