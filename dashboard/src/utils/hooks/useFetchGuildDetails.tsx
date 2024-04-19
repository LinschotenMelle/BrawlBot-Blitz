import { useEffect, useState } from "react";
import { Api } from "../api";
import { Guild } from "common/types/Guild";

export function useFetchGuildDetails(guildId: string) {
  const [guild, setGuild] = useState<Guild>();
  const [err, setErr] = useState<string>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    Api.instance
      .getGuildDetails(guildId)
      .then(({ data }) => setGuild(data))
      .catch((err) => setErr(err))
      .finally(() => setLoading(false));
  }, []);

  return { guild, err, loading };
}
