import { useEffect, useState } from "react";
import { Api } from "../api";
import { User } from "common/types/User";

export function useFetchUser() {
  const [user, setUser] = useState<User>();
  const [err, setErr] = useState<string>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    Api.instance
      .getAuthStatus()
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

export function useLogoutUser() {
  const logout = () => {
    Api.instance.postLogout();
  };

  return { logout };
}
