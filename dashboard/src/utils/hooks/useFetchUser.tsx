import { useEffect, useState } from "react";
import { Api } from "../api";
import { AuthApiFp, UserDto } from "../../client";

export function useFetchUser() {
  const [user, setUser] = useState<UserDto>();
  const [err, setErr] = useState<string>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    AuthApiFp()
      .authControllerMe()
      .then((response) => response.call(null).then(({ data }) => setUser(data)))
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
