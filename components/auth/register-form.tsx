"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerSchema } from "@/lib/validations/auth";
import { useSignUp } from "@/lib/auth/auth-hooks";
import { toast } from "sonner";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getSupabaseErrorMessage } from '@/lib/utils/supabase-errors';
import { ValidationService } from "@/lib/services/validation-service";

const formSchema = registerSchema;
const validationService = new ValidationService();

export function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const router = useRouter();
  const signUp = useSignUp();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      type: "client",
    },
    mode: "onChange",
  });

  const checkEmailAvailability = async (email: string) => {
    try {
      setIsCheckingEmail(true);
      const isTaken = await validationService.isEmailTaken(email);
      
      if (isTaken) {
        form.setError("email", {
          type: "manual",
          message: "Este email já está cadastrado"
        });
      }
    } catch (error) {
      console.error('Erro ao verificar email:', error);
    } finally {
      setIsCheckingEmail(false);
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);

      const signUpData = {
        email: values.email,
        password: values.password,
        fullName: values.name,
        type: values.type
      };
      
      await signUp(signUpData);

      toast.success("Conta criada com sucesso!", {
        description: "Redirecionando..."
      });

      if (values.type === "barbershop") {
        router.push("/register/barbershop");
      } else {
        router.push("/search");
      }
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? getSupabaseErrorMessage(error)
        : "Ocorreu um erro inesperado";
      
      toast.error("Erro ao criar conta", {
        description: errorMessage
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cadastro</CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Usuário</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo de usuário" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="client">Cliente</SelectItem>
                      <SelectItem value="barbershop">Barbearia</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Seu nome" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="seu@email.com"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        if (e.target.value && e.target.value.includes('@')) {
                          checkEmailAvailability(e.target.value);
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                  {isCheckingEmail && (
                    <p className="text-sm text-muted-foreground">
                      Verificando disponibilidade...
                    </p>
                  )}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="••••••"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirmar Senha</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="••••••"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Cadastrando..." : "Cadastrar"}
            </Button>
            <p className="text-sm text-center text-muted-foreground">
              Já tem uma conta?{" "}
              <Link
                href="/login"
                className="text-primary hover:underline"
              >
                Faça login
              </Link>
            </p>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}