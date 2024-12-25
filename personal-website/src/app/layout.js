import "./global.css";
import Main  from "./page.js";
export const metadata = {
  title: "Haoran's Website",
  description: "Personal Website made with nextJS",
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
