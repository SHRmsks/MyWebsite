import "./global.css";
import Main from "./page.js";
export const metadata = {
  title: "Haoran's Website",
  description: "Haoran Su's Personal Space",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Haoran's Website",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
