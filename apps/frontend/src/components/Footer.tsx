import { Mail, Github, Twitter, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";
function Footer() {
  return (
    <div className="w-full flex gap-2 md:gap-4 lg:gap-6 p-4 justify-center text-textSecondary text-lg font-normal">
      <a
        href="https://google.com"
        target="_blank"
        rel="noopener noreferrer"
        className="flex gap-1 md:gap-2 hover:text-textPrimary transition-colors duration-[150ms]"
      >
        <Mail />
        <p>Contact</p>
      </a>
      <a
        href="https://google.com"
        target="_blank"
        rel="noopener noreferrer"
        className="flex  gap-1 md:gap-2 hover:text-textPrimary transition-colors duration-[150ms]"
      >
        <Github />
        <p>Github</p>
      </a>
      <a
        href="https://google.com"
        target="_blank"
        rel="noopener noreferrer"
        className="flex  gap-1 md:gap-2 hover:text-textPrimary transition-colors duration-[150ms]"
      >
        <Twitter />
        <p>Twitter</p>
      </a>
      <a
        href="https://google.com"
        target="_blank"
        rel="noopener noreferrer"
        className="flex  gap-1 md:gap-2 hover:text-textPrimary transition-colors duration-[150ms]"
      >
        <Linkedin />
        <p>Linkedin</p>
      </a>
    </div>
  );
}

export default Footer;
