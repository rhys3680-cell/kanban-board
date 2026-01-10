import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useAuth } from "@/app/providers";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { Field, FieldError } from "@/shared/ui/field";
import { authSchema, type AuthFormValues, getAuthErrorMessage } from "@/features/auth";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const { signIn, signUp } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<AuthFormValues>({
    resolver: zodResolver(authSchema),
  });

  const onSubmit = async (data: AuthFormValues) => {
    try {
      if (isLogin) {
        await signIn(data.email, data.password);
        toast.success("로그인 성공!");
      } else {
        await signUp(data.email, data.password);
        toast.success("회원가입이 완료되었습니다! 이메일을 확인해주세요.");
      }
    } catch (err) {
      toast.error(getAuthErrorMessage(err));
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    reset();
  };

  return (
    <div className="min-h-screen w-full bg-linear-to-br from-gray-50 to-gray-100 flex items-center justify-center p-8">
      <Card className="w-full max-w-lg">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold bg-linear-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
            Kanban Board
          </CardTitle>
          <CardDescription>
            {isLogin ? "로그인하여 시작하세요" : "새 계정을 만드세요"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Field data-invalid={!!errors.email}>
              <Label htmlFor="email">이메일</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                {...register("email")}
              />
              <FieldError>{errors.email?.message}</FieldError>
            </Field>

            <Field data-invalid={!!errors.password}>
              <Label htmlFor="password">비밀번호</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                {...register("password")}
              />
              <FieldError>{errors.password?.message}</FieldError>
              {!isLogin && !errors.password && (
                <p className="text-xs text-muted-foreground">
                  최소 6자 이상이어야 합니다
                </p>
              )}
            </Field>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full"
            >
              {isSubmitting ? "처리 중..." : isLogin ? "로그인" : "회원가입"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Button
              variant="link"
              onClick={toggleMode}
              className="text-sm"
            >
              {isLogin
                ? "계정이 없으신가요? 회원가입"
                : "이미 계정이 있으신가요? 로그인"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
