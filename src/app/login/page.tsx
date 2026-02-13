"use client";

import { useSearchParams } from "next/navigation";
import { login, signup } from "@/lib/auth-actions";
import { cn } from "@/lib/utils";
import { Suspense } from "react";

function LoginForm() {
    const searchParams = useSearchParams();
    const error = searchParams.get("error");
    const message = searchParams.get("message");

    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4 py-12 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8">
                <div>
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-600/10 text-red-600">
                        <svg
                            className="h-10 w-10"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 10V3L4 14h7v7l9-11h-7z"
                            />
                        </svg>
                    </div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold tracking-tight text-white">
                        Sign in to <span className="text-red-600">Custom ERP</span>
                    </h2>
                    <p className="mt-2 text-center text-sm text-zinc-400">
                        Enterprise Grade Infrastructure
                    </p>
                </div>

                {error && (
                    <div className="rounded-md bg-red-600/10 p-4 border border-red-600/20">
                        <p className="text-sm text-red-600 text-center font-medium">{error}</p>
                    </div>
                )}

                {message && (
                    <div className="rounded-md bg-green-600/10 p-4 border border-green-600/20">
                        <p className="text-sm text-green-500 text-center font-medium">{message}</p>
                        {message === "Check your email to continue the registration process" && (
                            <p className="mt-2 text-sm text-zinc-400 italic text-center">No mail? Dont forget to check spam</p>
                        )}
                    </div>
                )}

                <form className="mt-8 space-y-6">
                    <div className="-space-y-px rounded-md shadow-sm">
                        <div>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="relative block w-full appearance-none rounded-t-md border border-zinc-800 bg-zinc-900 px-3 py-3 text-white placeholder-zinc-500 focus:z-10 focus:border-red-600 focus:outline-none focus:ring-red-600 sm:text-sm"
                                placeholder="Email address"
                            />
                        </div>
                        <div>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="relative block w-full appearance-none rounded-b-md border border-zinc-800 bg-zinc-900 px-3 py-3 text-white placeholder-zinc-500 focus:z-10 focus:border-red-600 focus:outline-none focus:ring-red-600 sm:text-sm"
                                placeholder="Password"
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                name="remember-me"
                                type="checkbox"
                                className="h-4 w-4 rounded border-zinc-800 bg-zinc-900 text-red-600 focus:ring-red-600"
                            />
                            <label
                                htmlFor="remember-me"
                                className="ml-2 block text-sm text-zinc-400"
                            >
                                Remember me
                            </label>
                        </div>

                        <div className="text-sm">
                            <a
                                href="#"
                                className="font-medium text-red-600 hover:text-red-500"
                            >
                                Forgot your password?
                            </a>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <button
                            formAction={login}
                            className="group relative flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-3 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-zinc-950 transition-colors"
                        >
                            Sign in
                        </button>
                        <button
                            formAction={signup}
                            className="group relative flex w-full justify-center rounded-md border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm font-medium text-white hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-700 focus:ring-offset-2 focus:ring-offset-zinc-950 transition-colors"
                        >
                            Sign up
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-zinc-950 text-white">Loading...</div>}>
            <LoginForm />
        </Suspense>
    )
}
