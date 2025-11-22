import Link from "next/link";

export default function Header() {
  return (
    <div className="w-full flex justify-center sticky top-0 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm z-50 border-b border-border-light dark:border-border-dark">
      <div className="w-full max-w-6xl px-4">
        <header className="flex items-center justify-between whitespace-nowrap py-4">
          <div className="flex items-center gap-3">
            <div className="size-6 text-primary">
              <svg fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.75 2.75a.75.75 0 00-1.5 0v8.5h-1.5a.75.75 0 000 1.5h1.5v7a.75.75 0 001.5 0v-7h1.5a.75.75 0 000-1.5h-1.5V2.75zM6 6a.75.75 0 01.75-.75h2.5a.75.75 0 010 1.5H6.75A.75.75 0 016 6zm-2.25 7.5a.75.75 0 000 1.5h2.5a.75.75 0 000-1.5h-2.5zM14.25 8a.75.75 0 000 1.5h3.5a.75.75 0 000-1.5h-3.5zm0 8.5a.75.75 0 000 1.5h2.5a.75.75 0 000-1.5h-2.5z"></path>
              </svg>
            </div>
            <h2 className="text-text-light-primary dark:text-text-dark-primary text-xl font-bold leading-tight">Trello</h2>
          </div>

          <div className="hidden md:flex flex-1 justify-center items-center gap-8">
            <a className="text-text-light-secondary dark:text-text-dark-secondary hover:text-primary dark:hover:text-primary text-sm font-medium leading-normal" href="#">Features</a>
            <a className="text-text-light-secondary dark:text-text-dark-secondary hover:text-primary dark:hover:text-primary text-sm font-medium leading-normal" href="#">Pricing</a>
            <a className="text-text-light-secondary dark:text-text-dark-secondary hover:text-primary dark:hover:text-primary text-sm font-medium leading-normal" href="#">About</a>
          </div>

          <div className="flex items-center gap-4">
            <a className="text-text-light-secondary dark:text-text-dark-secondary hover:text-primary dark:hover:text-primary text-sm font-medium" href="/login">Log In</a>

            {/* Sign Up button as Link */}
            <Link
              href="/signup"
              className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] shadow-soft hover:opacity-90 transition-opacity"
            >
              <span className="truncate">Sign Up</span>
            </Link>
          </div>
        </header>
      </div>
    </div>
  );
}
