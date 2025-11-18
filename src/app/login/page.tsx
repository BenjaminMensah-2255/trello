import LoginForm from '../components/LoginForm';

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen w-full flex-col group/design-root">
      <div className="layout-container flex h-full grow flex-col">
        <main className="flex-grow">
          <div className="flex h-full min-h-screen">
            {/* Left Panel: Illustration */}
            <div className="hidden lg:flex flex-1 items-center justify-center p-8 bg-background-light">
              <div className="w-full max-w-lg h-full bg-center bg-no-repeat bg-cover aspect-square rounded-lg bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center p-8">
                  <span className="material-symbols-outlined text-primary text-6xl mb-4">
                    deployed_code
                  </span>
                  <h2 className="text-2xl font-bold text-text-primary-light mb-2">
                    ProjectFlow
                  </h2>
                  <p className="text-text-secondary-light">
                    Streamline your workflow with our intuitive project management platform
                  </p>
                </div>
              </div>
            </div>

            {/* Right Panel: Login Form */}
            <LoginForm />
          </div>
        </main>
      </div>
    </div>
  );
}