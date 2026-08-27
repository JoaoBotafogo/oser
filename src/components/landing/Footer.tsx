import { Instagram, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { brand, contact, footer } from "@/config/site";

const channels = [
  { icon: MessageCircle, ...contact.whatsapp },
  { icon: Instagram, ...contact.instagram },
  { icon: Mail, ...contact.email },
  { icon: Phone, ...contact.phone },
  { icon: MapPin, ...contact.address },
];

export function Footer() {
  return (
    <footer className="bg-surface px-5 py-16 md:px-10 md:py-20">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-3">
        <div>
          <p className="wordmark text-xl text-foreground">{brand.name}</p>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
            {footer.description}
          </p>
        </div>

        <nav className="grid grid-cols-2 gap-3 self-start">
          {footer.links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <ul className="space-y-3">
          {channels.map(({ icon: Icon, label, value, href }) => (
            <li key={label}>
              <a
                href={href}
                className="flex items-start gap-3 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <Icon className="mt-0.5 size-4 shrink-0 text-primary" />
                <span>
                  <span className="block text-[0.65rem] tracking-[0.18em] uppercase text-muted-foreground/70">
                    {label}
                  </span>
                  {value}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="mx-auto mt-14 max-w-7xl border-t border-border pt-6">
        <p className="text-xs text-muted-foreground">{footer.legal}</p>
      </div>
    </footer>
  );
}
