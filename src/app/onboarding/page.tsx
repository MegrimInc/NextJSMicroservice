"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function OnboardingPage() {
    const router = useRouter();

    useEffect(() => {
        const initiateOnboarding = async () => {
            try {
                const res = await fetch("https://www.barzzy.site/postgres-test/merchant/onboarding", {
                    method: "POST",
                    credentials: "include", // IMPORTANT: includes cookies
                });

                if (res.status === 200) {
                    // Already onboarded → go to analytics
                    router.push("https://www.barzzy.site/website/analytics");
                } else if (res.status === 201) {
                    const link = await res.text();
                    window.location.href = link; // Redirect to Stripe onboarding
                } else {
                    // Unauthorized (401) or other → go to login
                    router.push("https://www.barzzy.site/website/login");
                }
            } catch (e) {
                console.error("Failed to initiate onboarding:", e);
                router.push("https://www.barzzy.site/website/login");
            }
        };

        initiateOnboarding();
    }, [router]);

    return (
        <div className="flex justify-center items-center min-h-screen">
            <p className="text-lg font-semibold">Redirecting to onboarding...</p>
        </div>
    );
}