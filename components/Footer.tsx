import { GENERAL_INFO, SOCIAL_LINKS } from '@/lib/data';

const Footer = () => {
  return (
    <footer className="text-center pb-5" id="contact">
      <div className="container">
        <p className="text-lg">Building a Web3 or fintech product?</p>
        <a
          href={`mailto:${GENERAL_INFO.email}?subject=${encodeURIComponent(
            GENERAL_INFO.emailSubject,
          )}&body=${encodeURIComponent(GENERAL_INFO.emailBody)}`}
          className="text-3xl sm:text-4xl font-anton inline-block mt-5 mb-8 hover:underline"
        >
          {GENERAL_INFO.email}
        </a>

        <div className="flex justify-center gap-5 text-muted-foreground">
          {SOCIAL_LINKS.map((link) => (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noreferrer noopener"
              className="capitalize hover:underline hover:text-white"
            >
              {link.name}
            </a>
          ))}
        </div>

        <p className="mt-6 text-sm text-muted-foreground">
          Design adapted and content revised by Guillaume Dumas.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
