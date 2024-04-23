import { Avatar, Container, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import {
  useFetchGuildChannels,
  useFetchGuildDetails,
} from "../utils/hooks/useFetchGuildDetails";
import { ExpandableCard } from "../components/ExpandableCard";
import { FaYoutube } from "react-icons/fa";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { GuildChannel } from "common/types/GuildChannel";
import { Role } from "common/types/Role";

function GuildDetailPage() {
  const { guildId } = useParams();

  const { guild, err, loading } = useFetchGuildDetails(guildId ?? "");
  const { channels } = useFetchGuildChannels(guildId ?? "");

  // Youtube form
  const [youtubeActive, setYoutubeActive] = useState<boolean>(false);
  const { register, handleSubmit } = useForm();

  if (loading) {
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
                />
                <label htmlFor="channelId">
                  <Typography variant="body1">Text Channel</Typography>
                </label>
                <select {...register("channelId")}>
                  {channels.map((e: GuildChannel) => {
                    return (
                      <option key={e.id} value={e.id}>
                        {e.name}
                      </option>
                    );
                  })}
                </select>
                <label htmlFor="title">
                  <Typography variant="body1">Title</Typography>
                </label>
                <input
                  {...register("title", { required: true })}
                  placeholder="Title"
                />
                <label htmlFor="message">
                  <Typography variant="body1">Message</Typography>
                </label>
                <textarea
                  {...register("message", { required: true })}
                  placeholder="Message"
                />
                <label htmlFor="channelId">
                  <Typography variant="body1">Role</Typography>
                </label>
                <select {...register("channelId")}>
                  {guild.roles.map((e: Role) => {
                    return (
                      <option key={e.id} value={e.id}>
                        {e.name}
                      </option>
                    );
                  })}
                </select>
                <input type="submit" />
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
