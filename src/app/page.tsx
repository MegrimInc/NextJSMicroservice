export default function HomePage() {
  return (
      <div className="min-h-screen bg-black text-white px-6 py-12 flex flex-col items-center">
        <div className="max-w-4xl w-full font-sans">
          <h1 className="text-5xl font-extrabold mb-6 text-center text-blue-400 drop-shadow-lg">
            Welcome to Barzzy 🍸
          </h1>

          <p className="text-xl mb-10 text-center text-gray-200 leading-relaxed">
            Your barzzy management platform. Update your drink menu, monitor sales, and run your bar like a pro.
          </p>

          <div className="bg-gray-900 rounded-xl p-8 shadow-md">
            <h2 className="text-3xl font-bold mb-6 text-blue-300">Get Started in 4 Easy Steps:</h2>
            <ol className="list-decimal list-inside space-y-5 text-white text-lg">
              <li>
                <strong>Register your bar</strong> using the <span className="text-blue-400 font-semibold">Register</span> tab.
                Enter your name, hours, location, and contact info.
              </li>
              <li>
                After registering, you'll be redirected to the <span className="text-blue-400 font-semibold">Menu</span> page.
                This is where you add your drinks and pricing.
              </li>
              <li>
                Use the <span className="text-blue-400 font-semibold">Analytics</span> tab to see your top sellers and busiest hours.
              </li>
              <li>
                Done for the day? Hit <span className="text-blue-400 font-semibold">Logout</span> to keep your account safe.
              </li>
            </ol>
          </div>

          <div className="mt-10 p-4 bg-yellow-200 border-l-4 border-yellow-500 text-yellow-900 rounded-md">
            Need help? Contact your Barzzy onboarding rep.
          </div>
        </div>
      </div>
  );
}
