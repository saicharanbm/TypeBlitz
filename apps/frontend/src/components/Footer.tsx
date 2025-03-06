import { Mail, Github, Twitter, Linkedin } from "lucide-react";
function Footer() {
  return (
    <div className="w-full flex gap-2 md:gap-4 lg:gap-6 p-4 pt-8 justify-center text-textSecondary text-lg font-normal select-none">
      <a
        href="mailto:saicharanbm.dev@gmail.com"
        className="flex gap-1  hover:text-textPrimary transition-colors duration-[150ms]"
      >
        <Mail />
        <p>Contact</p>
      </a>
      <a
        href="https://github.com/saicharanbm"
        target="_blank"
        rel="noopener noreferrer"
        className="flex  gap-1  hover:text-textPrimary transition-colors duration-[150ms]"
      >
        <Github />
        <p>Github</p>
      </a>
      <a
        href="https://x.com/saicharanbm"
        target="_blank"
        rel="noopener noreferrer"
        className="flex  gap-1  hover:text-textPrimary transition-colors duration-[150ms]"
      >
        <Twitter />
        <p>Twitter</p>
      </a>
      <a
        href="https://www.linkedin.com/in/sai-charan-b-m-95aa83190/"
        target="_blank"
        rel="noopener noreferrer"
        className="flex  gap-1  hover:text-textPrimary transition-colors duration-[150ms]"
      >
        <Linkedin />
        <p>Linkedin</p>
      </a>
    </div>
  );
}

export default Footer;
