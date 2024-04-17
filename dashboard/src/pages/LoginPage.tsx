import { FaDiscord } from "react-icons/fa";

export const LoginPage = () => {
  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <a
          href=""
          style={{
            backgroundColor: "#7289DA",
            color: "white",
            padding: "10px 20px",
            borderRadius: "5px",
            textDecoration: "none",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <FaDiscord size={20} style={{ marginRight: 10 }} />
          Login with Discord
        </a>
      </div>
    </>
  );
};
