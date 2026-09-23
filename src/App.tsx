import { BrowserRouter, Route, Routes } from "react-router-dom";
import { CreatorPage } from "./pages/CreatorPage";
import { GiftPage } from "./pages/GiftPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CreatorPage />} />
        <Route path="/arreglo" element={<GiftPage />} />
      </Routes>
    </BrowserRouter>
  );
}
