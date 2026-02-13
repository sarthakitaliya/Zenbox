'use client';

import { authClient } from "@/lib/auth-client";
import { FcGoogle } from "react-icons/fc";
import { useState } from "react";
import { FaEnvelope } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function SignIn() {
  const [isLoading, setIsLoading] = useState(false);
  const {data: session} = authClient.useSession();
  const router = useRouter();
  const JUST_SIGNED_IN_KEY = "zenbox:just-signed-in";

  if (session) {
    router.push("/mail/inbox");
  }

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      if (typeof window !== "undefined") {
        window.sessionStorage.setItem(JUST_SIGNED_IN_KEY, "1");
      }

      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/setup-categories",
        errorCallbackURL: "/auth/error",
        scopes: [
          "https://www.googleapis.com/auth/userinfo.email",
          "https://www.googleapis.com/auth/userinfo.profile",
          "https://www.googleapis.com/auth/gmail.modify",
          "https://www.googleapis.com/auth/gmail.readonly"
        ],
      });
    } catch (error) {
      if (typeof window !== "undefined") {
        window.sessionStorage.removeItem(JUST_SIGNED_IN_KEY);
      }
      console.error("Sign in error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100">
      <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          {/* Logo and Title */}
          <div className="text-center">
            <div className="mx-auto h-20 w-20 rounded-full bg-indigo-600 flex items-center justify-center">
              <FaEnvelope className="h-10 w-10 text-white" />
            </div>
            <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
              Welcome to Zenbox
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Your unified email management solution
            </p>
          </div>

          {/* Sign In Card */}
          <div className="mt-8 rounded-2xl bg-white p-8 shadow-xl ring-1 ring-gray-200">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Sign in to your account
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  Connect your email accounts to get started
                </p>
              </div>

              {/* Google Sign In Button */}
              <button
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="group relative flex w-full items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:hover:bg-white disabled:hover:shadow-sm"
              >
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <FcGoogle className="h-5 w-5" />
                </span>
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Connecting...
                  </span>
                ) : (
                  "Continue with Google"
                )}
              </button>

              {/* Features List */}
              <div className="mt-8 space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="ml-3 text-sm text-gray-600">
                    Secure and private email management
                  </p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="ml-3 text-sm text-gray-600">
                    Smart organization and categorization
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
