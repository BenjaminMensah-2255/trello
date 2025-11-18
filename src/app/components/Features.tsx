export default function Features() {
  const features = [
    {
      icon: 'dashboard',
      title: 'Kanban Boards',
      description: 'Visually organize your workflow with our intuitive drag-and-drop boards.'
    },
    {
      icon: 'groups',
      title: 'Team Collaboration',
      description: 'Communicate in real-time with comments, attachments, and notifications.'
    },
    {
      icon: 'task_alt',
      title: 'Task Tracking',
      description: 'Assign tasks, set deadlines, and monitor progress from a single view.'
    }
  ];

  return (
    <section className="py-16 sm:py-20 @container">
      <div className="flex flex-col items-center gap-4 text-center">
        <h2 className="text-text-light-primary dark:text-text-dark-primary text-3xl font-bold tracking-tight sm:text-4xl max-w-2xl">
          Everything you need to move work forward
        </h2>
        <p className="text-text-light-secondary dark:text-text-dark-secondary text-base sm:text-lg max-w-3xl">
          Our platform is built for teams that value clarity and efficiency. See why we're the top choice for modern project management.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-12">
        {features.map((feature, index) => (
          <div key={index} className="flex flex-col gap-4 rounded-lg border border-border-light dark:border-border-dark bg-white dark:bg-background-dark p-6 shadow-soft">
            <div className="flex items-center justify-center size-12 rounded-lg bg-primary/10 text-primary">
              <span className="material-symbols-outlined">{feature.icon}</span>
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="text-text-light-primary dark:text-text-dark-primary text-lg font-bold leading-tight">
                {feature.title}
              </h3>
              <p className="text-text-light-secondary dark:text-text-dark-secondary text-sm font-normal leading-normal">
                {feature.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}