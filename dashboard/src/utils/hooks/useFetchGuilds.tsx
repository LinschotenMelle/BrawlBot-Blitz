import { useEffect, useState } from "react";
import { Api } from "../api";
import { PartialGuild } from "common/types/Guild";

export function useFetchGuilds() {
  const [guilds, setGuilds] = useState<PartialGuild[]>();
  const [err, setErr] = useState<string>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    Api.instance
      .getGuilds()
      .then(({ data }) => setGuilds(data))
      .catch((err) => setErr(err))
      .finally(() => setLoading(false));
  }, []);

  return { guilds, err, loading };
}
