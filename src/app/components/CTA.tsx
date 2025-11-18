export default function CTA() {
  return (
    <section className="py-16 sm:py-20">
      <div className="bg-white dark:bg-background-dark border border-border-light dark:border-border-dark rounded-lg shadow-soft px-6 py-10 sm:p-16 text-center">
        <div className="flex flex-col items-center gap-4">
          <h2 className="text-text-light-primary dark:text-text-dark-primary text-2xl font-bold tracking-tight sm:text-3xl">
            Ready to Boost Your Productivity?
          </h2>
          <p className="text-text-light-secondary dark:text-text-dark-secondary text-base sm:text-lg max-w-xl">
            Join thousands of teams shipping projects faster. Sign up now and get started in seconds.
          </p>
          <form className="mt-4 flex flex-col sm:flex-row items-center gap-3 w-full max-w-md">
            <input 
              className="flex-1 w-full h-12 px-4 rounded border-border-light dark:border-border-dark bg-background-light dark:bg-gray-800 text-text-light-primary dark:text-text-dark-primary focus:ring-2 focus:ring-primary focus:border-primary" 
              placeholder="Enter your email" 
              type="email"
            />
            <button 
              className="w-full sm:w-auto flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded h-12 px-6 bg-primary text-white text-base font-bold leading-normal shadow-soft hover:opacity-90 transition-opacity" 
              type="submit"
            >
              <span className="truncate">Sign Up Now</span>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}