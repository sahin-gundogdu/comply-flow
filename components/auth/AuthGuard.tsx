"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const isLoginPage = pathname === "/login";

    if (!token && !isLoginPage) {
      // Redirect unauthenticated users to login page
      router.push("/login");
    } else if (token && isLoginPage) {
      // Redirect authenticated users away from login page to dashboard
      router.push("/");
    } else {
      // Allow access
      setIsAuthorized(true);
    }
  }, [pathname, router]);

  // Show nothing while determining authorization state to prevent flashing protected content
  if (!isAuthorized) {
    return null; 
  }

  return <>{children}</>;
}
