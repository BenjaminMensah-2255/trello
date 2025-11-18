export default function VisualFeature() {
  return (
    <section className="py-16 sm:py-20 flex flex-col items-center gap-8">
      <h2 className="text-text-light-primary dark:text-text-dark-primary text-3xl font-bold tracking-tight text-center sm:text-4xl">
        See Your Workflow in a New Light
      </h2>
      <div className="w-full grow bg-white dark:bg-background-dark p-2 rounded-lg border border-border-light dark:border-border-dark shadow-soft">
        <div className="w-full gap-1 overflow-hidden bg-white dark:bg-background-dark aspect-video flex">
          <div className="w-full aspect-auto rounded-md flex-1 overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80"
              alt="Project management dashboard showing Kanban board with multiple columns and tasks"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}