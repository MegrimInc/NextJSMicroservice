'use client';

import React, {useState} from "react";
import FormEntry from "@/components/ui/form/FormEntry";
import {useRouter} from "next/navigation";
import {apiRequest} from "@/lib/api/api";

export default function VerifyCodeForm() {
    const [verificationCode, setVerificationCode] = useState("");
    const router = useRouter();

    const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setVerificationCode(e.target.value);
    };

    const handleVerify = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await sendCode();

        if (await verifyCode(verificationCode)) {
            // we can make this look nicer later
            alert("You entered the correct code!");
            router.push("/");
        } else {
            // we can make this look nicer later
            alert("You entered the wrong code! Try again please, a new code was sent to your email.");
            await sendCode();
        }
    };

    const verifyCode = async (code: string) => {
        const storedFormData = sessionStorage.getItem("formData");
        if (!storedFormData) {
            return false;
        }
        const formData = JSON.parse(storedFormData);
        formData.verificationCode = code;

        try {
            await apiRequest<string>('newsignup/verify/bar', {
                method: 'POST',
                body: JSON.stringify(formData),
                skipAuth: true,
            });
        } catch (error) {
            console.log(error);
            return false;
        }

        return true;
    };

    const sendCode = async () => {
        const storedFormData = sessionStorage.getItem("formData");
        if (!storedFormData) {
            return;
        }
        const formData = JSON.parse(storedFormData);

        try {
            await apiRequest<string>('newsignup/register', {
                method: 'POST',
                body: JSON.stringify({email: formData.email}),
                skipAuth: true,
            });
        } catch (error) {
            console.log(error);
            return;
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="w-full max-w-md p-8 bg-white shadow-md rounded-lg">
                <h2 className="text-2xl font-bold text-center mb-6">Register</h2>
                <p className="p-5">You have been sent a 6 digit verification code. Please enter it here.</p>
                <form onSubmit={handleVerify} className="space-y-4">
                    <FormEntry
                        type="text"
                        name="code"
                        label="Verification Code"
                        value={verificationCode}
                        handleChange={handleCodeChange}
                        pattern={"[0-9]{6}"}
                    />
                    <button
                        type="submit"
                        className="mt-4 p-2 bg-blue-500 text-white rounded-md"
                    >
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );
}