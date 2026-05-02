import { GitBranch, Link2, Mail, Zap, Heart } from "lucide-react";

const socials = [
  { icon: GitBranch, href: "https://github.com/prayagsonagra", label: "GitHub" },
  { icon: Link2, href: "https://linkedin.com/in/prayagsonagra", label: "LinkedIn" },
  { icon: Mail, href: "mailto:prayag@example.com", label: "Email" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border-subtle py-10 mt-8">
      <div className="section-container">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-[8px] flex items-center justify-center bg-linear-to-br from-accent-primary to-accent-cyan">
              <Zap className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <p className="font-mono text-sm font-bold text-text-primary leading-tight">prayag.dev</p>
              <p className="font-mono text-xs text-text-muted">Full Stack Engineer</p>
            </div>
          </div>

          {/* Built with */}
          <p className="text-sm text-text-muted flex items-center gap-1.5 flex-wrap justify-center">
            Built with
            <Heart className="w-3.5 h-3.5 text-red-400 inline" />
            using{" "}
            <span className="font-mono text-accent-secondary">Next.js</span>
            {" ·"}
            <span className="font-mono text-accent-secondary">Framer Motion</span>
            {" ·"}
            <span className="font-mono text-accent-secondary">Tailwind CSS</span>
          </p>

          {/* Socials + copyright */}
          <div className="flex flex-col items-center sm:items-end gap-3">
            <div className="flex items-center gap-2">
              {socials.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg flex items-center justify-center bg-bg-elevated border border-border-subtle text-text-muted hover:text-accent-secondary hover:border-accent transition-all"
                >
                  <Icon className="w-3.5 h-3.5" />
                </a>
              ))}
            </div>
            <p className="font-mono text-xs text-text-muted">© {year} Prayag Sonagra</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
