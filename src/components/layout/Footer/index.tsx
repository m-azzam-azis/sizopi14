import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="w-full bg-background border-t border-border">
      <div className="mx-auto w-full max-w-7xl flex flex-col md:flex-row justify-between gap-7 md:gap-10 text-foreground py-10 md:py-16 px-5 md:px-10 relative z-50">
        <div className="flex gap-6 md:gap-6 items-center justify-center md:justify-start">
          <div className="font-hepta font-bold text-2xl md:text-4xl text-primary">
            Sizopi
          </div>
          <div className="text-foreground font-outfit text-xl md:text-lg font-medium">
            sizopi14@gmail.com
          </div>
          |
          <div className="flex gap-4">
            <a
              href="https://twitter.com"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Twitter size={20} />
            </a>
            <a
              href="https://facebook.com"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Facebook size={20} />
            </a>
            <a
              href="https://instagram.com"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Instagram size={20} />
            </a>
            <a
              href="https://linkedin.com"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Linkedin size={20} />
            </a>
          </div>
        </div>

        <div className="flex flex-col gap-4 items-center md:items-end text-center md:text-right">
          <p className="text-base md:text-lg font-medium text-muted-foreground">
            © 2025 Sizopi. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Designed and built with ❤️
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
