import { Route, Routes } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import { useFetchUser } from "./utils/hooks/useFetchUser";
import GuildsOverviewPage from "./pages/GuildsOverviewPage";
import { ResponsiveAppBar } from "./components/Appbar";
import GuildDetailPage from "./pages/GuildDetailsPage";

function App() {
  const { user, err } = useFetchUser();

  if (user && !err)
    return (
      <>
        <Routes>
          <Route path="*" element={<ResponsiveAppBar user={user} />} />
        </Routes>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/dashboard" element={<GuildsOverviewPage />} />
          <Route
            path="/dashboard/guild/:guildId"
            element={<GuildDetailPage />}
          />
        </Routes>
      </>
    );

  return (
    <>
      <Routes>
        <Route path="*" element={<ResponsiveAppBar />} />
      </Routes>
      <Routes>
        <Route path="/" element={<LoginPage />} />
      </Routes>
    </>
  );
}

export default App;
