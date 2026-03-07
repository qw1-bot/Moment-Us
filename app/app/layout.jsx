export const metadata = {
  title: "Moment Us",
  description: "一个只属于你们的空间",
};

import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
