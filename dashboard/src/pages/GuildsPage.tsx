import { Avatar, Container, Typography } from "@mui/material";
import { useFetchGuilds } from "../utils/hooks/useFetchGuilds";
import { FaChevronRight, FaDiscord } from "react-icons/fa";
import { useState } from "react";

function GuildsPage() {
  const { guilds, loading } = useFetchGuilds();
  const [hoveredGuildId, setHoveredGuildId] = useState<string | null>(null);

  const inviteNewServer = () => {
    window.location.href =
      "https://discord.com/oauth2/authorize?client_id=1224804703104405595&permissions=8&scope=bot";
  };

  if (loading) {
    return (
      <Container maxWidth="xl">
        <Typography variant="h6">Loading guilds...</Typography>
      </Container>
    );
  }

  return (
    <>
      <Container maxWidth="xl">
        {guilds?.map((guild) => {
          const isHovered = hoveredGuildId === guild.id;

          return (
            <button
              onClick={() => {
                if (guild.isActive) {
                  window.location.href = `/dashboard/guild/${guild.id}`;
                }
              }}
              key={guild.id}
              rel="noopener noreferrer"
              style={{
                textDecoration: "none",
                backgroundColor:
                  isHovered && guild.isActive
                    ? "rgba(0, 0, 0, 0.1)"
                    : "inherit",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                width: "100%",
                border: "none",
                cursor: guild.isActive ? "pointer" : "default",
                paddingTop: 8,
                paddingBottom: 8,
              }}
              onMouseEnter={() => setHoveredGuildId(guild.id)}
              onMouseLeave={() => setHoveredGuildId(null)}
            >
              <div
                key={guild.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <Avatar
                  src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`}
                  component="div"
                  alt={guild.name}
                  style={{ marginRight: 16 }}
                />
                <Typography variant="h6" width="100%" textAlign={"left"}>
                  {guild.name}
                </Typography>
                {guild.isActive ? (
                  <FaChevronRight />
                ) : (
                  <button
                    onClick={inviteNewServer}
                    style={{
                      backgroundColor: "#7289DA",
                      color: "white",
                      padding: "10px 20px",
                      borderRadius: "5px",
                      textDecoration: "none",
                      display: "flex",
                      alignItems: "center",
                      width: 200,
                      justifyContent: "center",
                      cursor: "pointer",
                      border: "none",
                    }}
                  >
                    <FaDiscord size={20} style={{ marginRight: 10 }} />
                    Invite to server
                  </button>
                )}
              </div>
            </button>
          );
        })}
      </Container>
    </>
  );
}

export default GuildsPage;
