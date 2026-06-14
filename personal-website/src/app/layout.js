import "./global.css";
import Main  from "./page.js";
export const metadata = {
  title: "Haoran's Website",
  description: "Haoran's Personal Website",
};

export default function RootLayout({children }) {
  return (
    <html lang="en">
      <body
      >
      {children}
      </body>
    </html>
  );
}
