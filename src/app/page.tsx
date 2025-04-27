"use client";

// @ts-ignore
import { FaCloud, FaGift, FaChartLine } from "react-icons/fa";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react"; // Add this at the top

export default function HomePage() {

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleGetStarted = async () => {
    setIsLoading(true);
    try {
      // Call backend API to create Stripe account and get onboarding URL
      const response = await fetch('/api/create-connected-account', {
        method: 'POST'
      });
      
      if (!response.ok) throw new Error('Failed to create account');
      
      const { onboardingUrl } = await response.json();
      
      // Redirect to Stripe onboarding
      window.location.href = onboardingUrl;
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white w-full min-h-screen font-sans">
      {/* Hero Section with Cloud-Based Ordering & Rewards Focus */}
      <header className="relative overflow-hidden bg-gradient-to-r from-black via-gray-900 to-gray-700 pb-32">
        <nav className="flex items-center justify-between max-w-7xl mx-auto py-6 px-4">
          {/* Removed "Megrim" text and its Megrim font styling */}
          <div className="text-3xl text-white font-extrabold drop-shadow-md">
            {/* Optionally, insert a logo image here */}
          </div>
          {/* Navigation is handled elsewhere */}
        </nav>
        
        <div className="relative max-w-7xl mx-auto px-4 py-16 text-white text-center">
          <h1 className="text-5xl sm:text-6xl font-extrabold leading-tight drop-shadow-lg uppercase">
            Transform Your Orders & Rewards
          </h1>
          <p className="mt-6 text-xl max-w-2xl mx-auto">
            Megrim delivers cloud-based ordering, seamless digital rewards, and real-time analytics—empowering your business to grow revenue and foster customer loyalty.
          </p>
          <div className="mt-8">
          <button 
  onClick={handleGetStarted} // Remove Link wrapper
  className="inline-block bg-black text-white px-6 py-3 rounded-md mr-4 hover:bg-gray-800 transition"
>
  {isLoading ? 'Creating Account...' : 'Get Started'}
</button>
<a 
  href="https://www.linkedin.com/company/megrim/" 
  target="_blank" 
  rel="noopener noreferrer"
  className="inline-block bg-transparent border border-white text-white px-6 py-3 rounded-md hover:bg-white hover:text-black transition"
>
  Learn More
</a>
          </div>
        </div>
        {/* Decorative floating shape */}
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-gradient-to-tr from-white/20 to-white/10 rounded-full blur-3xl transform translate-x-1/4 translate-y-1/4"></div>
      </header>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-10">
            Power Your Business with Megrim
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              title="Cloud-Based Ordering"
              description="Streamline orders directly from your customers with an intuitive, scalable cloud system."
              icon={<FaCloud className="text-black text-4xl" />}
            />
            <FeatureCard
              title="Digital Rewards & Points"
              description="Boost loyalty by rewarding every order. Track both cash and point-based transactions seamlessly."
              icon={<FaGift className="text-black text-4xl" />}
            />
            <FeatureCard
              title="Real-Time Analytics"
              description="Make smarter decisions with instant revenue tracking, customer insights, and performance dashboards."
              icon={<FaChartLine className="text-black text-4xl" />}
            />
          </div>
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section className="py-16 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600 text-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-extrabold mb-4 drop-shadow-md">
            Ready to Boost Your Business?
          </h2>
          <p className="text-lg mb-10 opacity-90">
            Integrate orders, rewards, and analytics into one seamless experience.
          </p>
          <button 
  onClick={handleGetStarted} // Remove Link wrapper
  className="inline-block bg-black text-white px-6 py-3 rounded-md mr-4 hover:bg-gray-800 transition"
>
  {isLoading ? 'Creating Account...' : 'Get Started'}
</button>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-black text-gray-400 py-8">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between">
          <p className="text-sm">&copy; {new Date().getFullYear()} Megrim, Inc. All rights reserved.</p>
          <ul className="flex space-x-4 text-sm mt-4 sm:mt-0">
            <li>
              <a href="#" className="hover:text-gray-200">
                Privacy
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-gray-200">
                Terms
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-gray-200">
                Security
              </a>
            </li>
          </ul>
        </div>
      </footer>
    </div>
  );
}

interface FeatureCardProps {
  title: string;
  description: string;
  icon: JSX.Element;
}

function FeatureCard({ title, description, icon }: FeatureCardProps) {
  return (
    <div className="bg-white rounded-lg p-6 shadow hover:shadow-xl transition flex flex-col items-center">
      <div className="mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600 text-center leading-relaxed">{description}</p>
    </div>
  );
}