import SignupForm from '../components/SignupForm';

export default function RegisterPage() {
  return (
    <div className="relative flex min-h-screen w-full flex-col group/design-root">
      <div className="layout-container flex h-full grow flex-col">
        <main className="grow">
          <div className="flex h-full min-h-screen">
            {/* Left Panel: Illustration */}
            <div className="hidden lg:flex flex-1 items-center justify-center p-8 bg-background-light">
              <div className="w-full max-w-lg h-full bg-center bg-no-repeat bg-cover aspect-square rounded-lg bg-linear-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center p-8">
                  <span className="material-symbols-outlined text-primary text-6xl mb-4">
                    group_add
                  </span>
                  <h2 className="text-2xl font-bold text-text-primary-light mb-2">
                    Join Trello
                  </h2>
                  <p className="text-text-secondary-light">
                    Start managing your projects efficiently with our powerful collaboration tools
                  </p>
                </div>
              </div>
            </div>

            <SignupForm />
          </div>
        </main>
      </div>
    </div>
  );
}