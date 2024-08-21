import { useEffect, useState } from "react";
import { Api } from "../api";
import { PartialGuildDto } from "../../client";

export function useFetchGuilds() {
  const [guilds, setGuilds] = useState<PartialGuildDto[]>();
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
