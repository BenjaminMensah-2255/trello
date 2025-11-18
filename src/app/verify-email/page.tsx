import VerifyEmailForm from '../components/VerifyEmailForm';

export default function VerifyEmailPage() {
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
                    mark_email_read
                  </span>
                  <h2 className="text-2xl font-bold text-text-primary-light mb-2">
                    Verify Your Email
                  </h2>
                  <p className="text-text-secondary-light">
                    Secure your account and unlock all ProjectFlow features
                  </p>
                </div>
              </div>
            </div>

            {/* Right Panel: Verification Form */}
            <VerifyEmailForm />
          </div>
        </main>
      </div>
    </div>
  );
}