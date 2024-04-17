import { FaDiscord } from "react-icons/fa";

export const NotFoundPage = () => {
  const redirect = () => {
    window.location.href = "/";
  };

  return (
    <>
      <div
        style={{
          display: "block",
          justifyContent: "center",
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <div
          style={{
            marginLeft: "auto",
            marginRight: "auto",
            textAlign: "center",
          }}
        >
          404 Not Found
        </div>
        <div style={{ height: "20px" }} />
        <button
          onClick={redirect}
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
          HomePage
        </button>
      </div>
    </>
  );
};
