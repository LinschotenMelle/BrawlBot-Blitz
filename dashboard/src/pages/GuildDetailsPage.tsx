import { Container, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import {
  useFetchGuildChannels,
  useFetchGuildDetails,
} from "../utils/hooks/useFetchGuildDetails";

function GuildDetailPage() {
  const { guildId } = useParams();

  const { guild, err, loading } = useFetchGuildDetails(guildId ?? "");
  const { channels } = useFetchGuildChannels(guildId ?? "");

  if (loading) {
    return (
      <Container maxWidth="xl">
        <Typography variant="h6">Loading guilds...</Typography>
      </Container>
    );
  }

  if (!guild || err) {
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
        <Typography variant="h6">{guild.name}</Typography>
        {channels?.map((channel) => (
          <Typography key={channel.id}>{channel.name}</Typography>
        ))}
      </Container>
    </>
  );
}

export default GuildDetailPage;
