import { Toaster } from "react-hot-toast";
import TodoPage from "./pages/TodoPage";

export default function App() {
  return (
    <>
      <TodoPage />
      <Toaster position="top-right" toastOptions={{ duration: 2500 }} />
    </>
  );
}