import { useEffect, useState } from "react";
import { getGuilds } from "../api";
import { PartialGuild } from "common/types/Guild";

export function useFetchGuilds() {
  const [guilds, setGuilds] = useState<PartialGuild[]>();
  const [err, setErr] = useState<string>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getGuilds()
      .then(({ data }) => setGuilds(data))
      .catch((err) => {
        console.error(err);
        return setErr(err);
      })
      .finally(() => {
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      });
  }, []);

  return { guilds, err, loading };
}
