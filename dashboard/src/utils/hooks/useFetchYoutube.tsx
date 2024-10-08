import { useEffect, useState } from "react";
import { Api } from "../api";
import { YoutubeChannelDto } from "../../client";

export function useFetchYoutubeData(guildId: string) {
  const [ytData, setGuilds] = useState<YoutubeChannelDto>();
  const [err, setErr] = useState<string>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    Api.instance
      .getYoutubeData(guildId)
      .then(({ data }) => setGuilds(data))
      .catch((err) => setErr(err))
      .finally(() => setLoading(false));
  }, []);

  return { ytData, err, loading };
}

// export function usePutYoutubeData(guildId: string, values: FieldValues) {
//   const map = new Map<string, string>();
//   values.map((value: { name: string; value: string }) => {
//     map.set(value.name, value.value);
//   });
//   console.log(map);
//   Api.instance.putYoutubeData(guildId, map);
// }
