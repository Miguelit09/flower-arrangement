import { BrowserRouter, Route, Routes } from "react-router-dom";
import { CreatorPage } from "./pages/CreatorPage";
import { GiftPage } from "./pages/GiftPage";

const basename = import.meta.env.BASE_URL.replace(/\/$/, "") || "/";

export default function App() {
  return (
    <BrowserRouter basename={basename}>
      <Routes>
        <Route path="/" element={<CreatorPage />} />
        <Route path="/arreglo" element={<GiftPage />} />
      </Routes>
    </BrowserRouter>
  );
}
