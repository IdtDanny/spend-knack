import AcmeLogo from "@/app/ui/acme-logo";
import { RegisterForm } from "@/app/ui/login-form";
import { Metadata } from 'next';
import { CopyrightIcon } from "../ui/dashboard/icon-template";

export const metadata: Metadata = {
    title: 'Register',
};

export default function RegisterPage() {
    return (
        <main className="flex items-center justify-center md:h-screen">
            <div className="relative mx-auto flex w-full max-w-[600px] flex-col space-y-2.5 p-4 md:-mt-32">
                <div className="flex h-20 w-full items-end rounded-lg bg-teal-700 p-3 md:h-32">
                    <div className="w-32 text-white md:w-36">
                        <AcmeLogo />
                    </div>
                </div>
                <RegisterForm />
                <CopyrightIcon className={`text-l text-gray-600`} />
            </div>
        </main>
    );
}