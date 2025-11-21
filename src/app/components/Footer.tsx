export default function Footer() {
  return (
    <footer className="w-full flex justify-center py-10 border-t border-border-light dark:border-border-dark mt-10">
      <div className="w-full max-w-6xl px-4 flex flex-col sm:flex-row justify-between items-center gap-6">
        <p className="text-text-light-secondary dark:text-text-dark-secondary text-sm">
          © 2025 Trello. All rights reserved.
        </p>
        <div className="flex items-center gap-6">
          <a className="text-text-light-secondary dark:text-text-dark-secondary hover:text-primary dark:hover:text-primary text-sm font-medium leading-normal" href="#">Contact</a>
          <a className="text-text-light-secondary dark:text-text-dark-secondary hover:text-primary dark:hover:text-primary text-sm font-medium leading-normal" href="#">Privacy Policy</a>
          <a className="text-text-light-secondary dark:text-text-dark-secondary hover:text-primary dark:hover:text-primary text-sm font-medium leading-normal" href="#">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}