import ForgotPasswordForm from '../components/ForgotPasswordForm';

export default function ForgotPasswordPage() {
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
                    lock_reset
                  </span>
                  <h2 className="text-2xl font-bold text-text-primary-light mb-2">
                    Reset Your Password
                  </h2>
                  <p className="text-text-secondary-light">
                    We'll help you get back into your account quickly and securely
                  </p>
                </div>
              </div>
            </div>

            {/* Right Panel: Forgot Password Form */}
            <ForgotPasswordForm />
          </div>
        </main>
      </div>
    </div>
  );
}