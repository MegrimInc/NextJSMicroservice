"use client";

import React from "react";
import RegisterForm from "@/components/ui/form/RegisterForm";

export default function RegistrationPage() {
    return (
        <div className="min-h-screen p-8 pb-20 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <main className="flex justify-center">
                <RegisterForm />
            </main>
        </div>
    );
}
