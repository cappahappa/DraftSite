import { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./sections/Footer";
import { ChatBubble } from "./ChatBubble";

export const PageLayout = ({ children, transparentHeader = true }: { children: ReactNode; transparentHeader?: boolean }) => {
  return (
    <div className="min-h-screen bg-background">
      <Header transparent={transparentHeader} />
      <main>{children}</main>
      <Footer />
      <ChatBubble />
    </div>
  );
};
