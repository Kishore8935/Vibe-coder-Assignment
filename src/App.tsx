import { BrowserRouter, Route, Routes } from "react-router-dom";
import { MotionConfig } from "framer-motion";
import { Toaster } from "@/components/ui/sonner";
import { SearchPage } from "@/pages/SearchPage";
import { ProfileDetailPage } from "@/pages/ProfileDetailPage";
import { SavedListPage } from "@/pages/SavedListPage";
import { NotFoundPage } from "@/pages/NotFoundPage";

function App() {
  return (
    // reducedMotion="user" disables transform/layout animations app-wide
    // for users with a prefers-reduced-motion OS setting.
    <MotionConfig reducedMotion="user">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SearchPage />} />
          <Route path="/profile/:username" element={<ProfileDetailPage />} />
          <Route path="/list" element={<SavedListPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </MotionConfig>
  );
}

export default App;
