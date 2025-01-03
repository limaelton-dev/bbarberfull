import { RegisterForm } from "@/components/auth/register-form";
import { Scissors } from "lucide-react";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-secondary p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center space-x-2">
            <Scissors className="h-8 w-8" />
            <h1 className="text-2xl font-bold">BarberBook</h1>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Crie sua conta para começar
          </p>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
}