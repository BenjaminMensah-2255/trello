export default function Hero() {
  return (
    <section className="text-center py-20 sm:py-28">
      <div className="flex flex-col items-center gap-6">
        <h1 className="text-text-light-primary dark:text-text-dark-primary text-4xl font-black leading-tight tracking-tighter sm:text-5xl md:text-6xl max-w-3xl">
          Effortless Project Management for Modern Teams
        </h1>
        <p className="text-text-light-secondary dark:text-text-dark-secondary text-base sm:text-lg max-w-2xl">
          Organize tasks, collaborate with your team, and ship projects faster with our intuitive visual platform.
        </p>
        <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded h-12 px-6 bg-primary text-white text-base font-bold leading-normal tracking-[0.015em] shadow-soft hover:opacity-90 transition-opacity">
          <span className="truncate">Get Started for Free</span>
        </button>
      </div>
    </section>
  );
}