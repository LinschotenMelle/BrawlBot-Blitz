import { Avatar, Container, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import {
  useFetchGuildChannels,
  useFetchGuildDetails,
} from "../utils/hooks/useFetchGuildDetails";
import { ExpandableCard } from "../components/ExpandableCard";
import { FaYoutube } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useFetchYoutubeData } from "../utils/hooks/useFetchYoutube";
import { GuildChannelDto, RoleDto } from "../client";

function GuildDetailPage() {
  const { guildId } = useParams();

  const { guild, err, loading } = useFetchGuildDetails(guildId ?? "");
  const { channels } = useFetchGuildChannels(guildId ?? "");

  // Youtube form
  const { ytData } = useFetchYoutubeData(guildId ?? "");
  const [youtubeActive, setYoutubeActive] = useState<boolean>(false);
  const { register, handleSubmit } = useForm();

  useEffect(() => {
    if (ytData) {
      setYoutubeActive(ytData.isActive);
    }
  }, [ytData]);

  if (loading && !guild) {
    return (
      <Container maxWidth="xl">
        <Typography variant="h6">Loading guilds...</Typography>
      </Container>
    );
  }

  if (!guild || err || !channels) {
    return (
      <>
        <Container maxWidth="xl">
          <Typography variant="h6">Guild not found</Typography>
        </Container>
      </>
    );
  }

  return (
    <>
      <Container maxWidth="xl">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            margin: "16px 0",
          }}
        >
          <Avatar
            src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`}
            component="div"
            alt={guild.name}
            style={{ marginRight: 16 }}
          />
          <Typography variant="h6">{guild.name}</Typography>
        </div>
        <ExpandableCard
          title={
            <>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <FaYoutube
                  size={30}
                  style={{
                    marginRight: "10px",
                    color: "red",
                  }}
                />
                <Typography variant="h6">Youtube</Typography>
              </div>
            </>
          }
          content={
            <>
              <form onSubmit={handleSubmit((data) => console.log(data))}>
                <label htmlFor="id">
                  <Typography variant="body1">Youtube Channel ID</Typography>
                </label>
                <input
                  {...register("id", { required: true })}
                  placeholder="Youtube Channel ID"
                  value={ytData?.guildChannelId}
                />
                <label htmlFor="channelId">
                  <Typography variant="body1">Text Channel</Typography>
                </label>
                <select
                  {...register("channelId")}
                  defaultValue={ytData?.guildChannelId}
                >
                  {channels.map((e: GuildChannelDto) => {
                    return (
                      <option key={e.id} value={e.id}>
                        {e.name}
                      </option>
                    );
                  })}
                </select>
                <label htmlFor="channelId">
                  <Typography variant="body1">Role</Typography>
                </label>
                <select {...register("roleId")} defaultValue={ytData?.roleId}>
                  {guild.roles.map((e: RoleDto) => {
                    return (
                      <option key={e.id} value={e.id}>
                        {e.name}
                      </option>
                    );
                  })}
                </select>
                <input
                  type="hidden"
                  value={guildId}
                  {...register("guild_id", { required: true })}
                />
                <input
                  type="hidden"
                  value={youtubeActive.toString()}
                  {...register("active", { required: true })}
                />
                <input
                  style={{
                    marginTop: "20px",
                    padding: "10px",
                    color: "white",
                    backgroundColor: "#DE7456",
                    border: "none",
                    borderRadius: "5px",
                  }}
                  type="submit"
                />
              </form>
            </>
          }
          state={[youtubeActive, setYoutubeActive]}
        />
      </Container>
    </>
  );
}

export default GuildDetailPage;
