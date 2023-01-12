import { useSupabaseClient } from "@supabase/auth-helpers-react";
import Image from "next/image";
import LogInForm from "../components/login/LogInForm";

export default function LogIn() {
  const supabaseClient = useSupabaseClient();
  return (
    <>
      <div className="flex flex-col items-center">
        <Image src="/logo.png" alt="" width={350} height={350} />
        <p className="text-3xl font-bold mb-8">Log in</p>
        <p className="text-2xl font-light">as</p>
        <LogInForm />
      </div>
    </>
  );
}
