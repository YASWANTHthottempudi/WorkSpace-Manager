import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import ReduxProvider from "@/store/ReduxProvider";

export const metadata = {
  title: "AI Knowledge Workspace",
  description: "A collaborative editor with AI superpowers",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ReduxProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}