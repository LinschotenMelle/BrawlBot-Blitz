import { useEffect, useState } from "react";
import { getGuildDetails } from "../api";
import { PartialGuild } from "common/types/Guild";

export function useFetchGuilds(guildId: string) {
  const [guild, setGuild] = useState<PartialGuild[]>();
  const [err, setErr] = useState<string>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getGuildDetails(guildId)
      .then(({ data }) => setGuild(data))
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

  return { guild, err, loading };
}
