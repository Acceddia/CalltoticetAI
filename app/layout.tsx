
import "./globals.css";

export const metadata = {
  title: "NovaFlow AI — Call-first automation",
  description: "AI answers your business calls and turns them into tickets — instantly.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
