import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import {useUserStore} from "@repo/store";
import Loading from "./Loading";

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const { setUser } = useUserStore();

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/auth/signin");
      return;
    }
    if(session && session.user){
      setUser(session.user);    
    }
  }, [session, isPending]);

  if (isPending) {
    return <Loading />;
  }
  return <>{children}</>;
}
