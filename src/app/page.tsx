import { Megrim } from "next/font/google";

const megrim = Megrim({
  subsets: ["latin"],
  weight: "400",
});

export default function HomePage() {
  return (
      <div className="min-h-screen bg-white text-black flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-4xl text-center">
          <h1 className={`text-6xl font-extrabold mb-8 drop-shadow-md uppercase ${megrim.className}`}>
            Welcome to Megrim
          </h1>

          <p className="text-2xl mb-12 text-gray-700 leading-relaxed">
            Your Megrim Management Platform — Megrim helps you track sales, customize menus, and grow fast.
          </p>

          <div className="bg-white shadow-lg rounded-xl p-8 border border-gray-300">
            <h2 className="text-4xl font-bold mb-6 text-black">
              Get Started in 4 Simple Steps:
            </h2>
            <ol className="list-decimal list-inside space-y-4 text-xl text-black">
              <li>
                <strong>Register your business</strong> using the{" "}
                <span className="underline font-semibold">Register</span> tab. Fill out your name, hours, address, and
                email.
              </li>
              <li>
                After registering, you'll be redirected to the <span className="underline font-semibold">Stripe Dashboard</span> to
                add your payment information.
              </li>
              <li>
                Then head to the {" "}
                <span className="underline font-semibold">Menu</span> page where you add your products and pricing.
              </li>
              <li>
                Use the{" "}
                <span className="underline font-semibold">Analytics</span> tab to track revenue and customer behavior.
              </li>
              <li>
                When finished, click <span className="underline font-semibold">Logout</span> to sign out securely.
              </li>
            </ol>
          </div>
          <div className="mt-10 p-4 bg-gray-100 border border-gray-400 rounded-md text-center text-gray-800">
            Need help? Contact your Megrim onboarding specialist.
          </div>
        </div>
      </div>
  );
}
