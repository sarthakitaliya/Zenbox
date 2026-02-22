import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import {useUserStore} from "@repo/store";
import Loading from "./Loading";

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const { setUser, clearUser } = useUserStore();

  useEffect(() => {
    if (!isPending && !session) {
      clearUser();
      router.replace("/auth/signin");
      return;
    }
    if(session && session.user){
      setUser(session.user);    
    }
  }, [session, isPending, router, setUser, clearUser]);

  if (isPending || !session) {
    return <Loading />;
  }
  return <>{children}</>;
}
