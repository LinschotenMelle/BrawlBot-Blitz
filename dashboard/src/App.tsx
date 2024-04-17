import { Route, Routes } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import { useFetchUser } from "./utils/hooks/useFetchUser";
import GuildsPage from "./pages/GuildsPage";
import { ResponsiveAppBar } from "./components/Appbar";

function App() {
  const { user, err } = useFetchUser();

  if (user && !err)
    return (
      <>
        <Routes>
          <Route
            path="/dashboard/*"
            element={<ResponsiveAppBar user={user} />}
          />
        </Routes>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/dashboard" element={<GuildsPage />} />
        </Routes>
      </>
    );

  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
    </Routes>
  );
}

export default App;
