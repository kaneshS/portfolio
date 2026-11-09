export function Footer() {
  return (
    <footer className="border-t border-rule py-8" style={{ paddingBottom: "max(2rem, env(safe-area-inset-bottom))" }}>
      <div className="container flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[0.8rem] text-fg-faint">
        <p>© {new Date().getFullYear()} Kaneshwar Sharma</p>
        <p>
          <span className="prompt">$</span> built with next.js · tailwind · geist mono <span className="text-fg-faint">{"// "}exit 0</span>
        </p>
      </div>
    </footer>
  );
}
