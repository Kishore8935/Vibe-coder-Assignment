import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { SearchPage } from "@/pages/SearchPage";
import { ProfileDetailPage } from "@/pages/ProfileDetailPage";
import { SavedListPage } from "@/pages/SavedListPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SearchPage />} />
        <Route path="/profile/:username" element={<ProfileDetailPage />} />
        <Route path="/list" element={<SavedListPage />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
