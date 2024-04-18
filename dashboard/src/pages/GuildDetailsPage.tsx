import { Container, Typography } from "@mui/material";
import { useParams } from "react-router-dom";

function GuildDetailPage() {
  const { guildId } = useParams();

  return (
    <>
      <Container maxWidth="xl">
        <Typography variant="h6">Guild: {guildId}</Typography>
      </Container>
    </>
  );
}

export default GuildDetailPage;
