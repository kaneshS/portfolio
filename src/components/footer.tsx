"use client";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-8 border-t border-border">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {currentYear} Kanesh. Built with Next.js and Tailwind CSS.
          </p>
          <p className="text-sm text-muted-foreground">
            Designed with care for great user experience.
          </p>
        </div>
      </div>
    </footer>
  );
}
