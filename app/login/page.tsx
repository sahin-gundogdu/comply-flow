"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ShieldCheck, ArrowLeft, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const BASE_URL = 'https://localhost:5001/api';

export default function LoginPage() {
  const [isForgotPass, setIsForgotPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState("administrator");
  const [password, setPassword] = useState("1");
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/Auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      // 1. Check for wrong credentials specifically
      if (response.status === 401 || response.status === 400) {
          throw new Error("Kullanıcı adı veya şifre hatalı.");
      }

      // 2. Check for other server errors (500, etc.)
      if (!response.ok) {
        throw new Error("Sunucu ile iletişimde bir sorun oluştu.");
      }

      const data = await response.json();
      
      // Assuming the API returns a token
      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      toast({
        title: "Giriş Başarılı",
        description: "Gösterge paneline yönlendiriliyorsunuz...",
      });
      
      router.push("/");
    } catch (error: any) {
      let errorMessage = "Giriş yapılırken beklenmeyen bir hata oluştu.";

      // 3. Catch true network disconnects (API is offline)
      if (error?.message?.includes('Failed to fetch') || error?.message?.includes('NetworkError') || error instanceof TypeError) {
          errorMessage = "Sunucuya ulaşılamıyor. Lütfen bağlantınızı kontrol edip tekrar deneyin.";
      } else if (error.message) {
          // 4. Catch the specific messages we threw above
          errorMessage = error.message;
      }

      toast({
        title: "Hata",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPass = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Kod Gönderildi",
      description: "Şifre sıfırlama bağlantısı e-posta adresinize iletildi.",
    });
    setTimeout(() => {
        setIsForgotPass(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-indigo-50 dark:from-slate-900 dark:to-indigo-950 p-4">
      {/* Main Dual-Panel Container */}
      <div className="relative w-full max-w-[1000px] h-[600px] bg-white dark:bg-slate-950 rounded-2xl shadow-2xl overflow-hidden flex">
        
        {/* LEFT PANEL: Forgot Password Form */}
        <div className="w-1/2 h-full absolute left-0 flex flex-col justify-center px-12 z-0">
          <div className="w-full max-w-sm mx-auto space-y-6">
            <div className="space-y-2 text-center">
              <h2 className="text-3xl font-bold tracking-tight">Şifremi Unuttum</h2>
              <p className="text-muted-foreground text-sm">
                E-posta adresinizi girin, size bir sıfırlama bağlantısı gönderelim.
              </p>
            </div>
            <form onSubmit={handleForgotPass} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-posta</Label>
                <Input id="email" type="email" placeholder="ornek@sirket.com" required />
              </div>
              <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
                Şifreyi Sıfırla
              </Button>
            </form>
            <div className="text-center mt-6">
              <button
                type="button"
                onClick={() => setIsForgotPass(false)}
                className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-500 hover:underline font-medium"
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Geri Dön
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: Login Form */}
        <div className="w-1/2 h-full absolute right-0 flex flex-col justify-center px-12 z-0">
          <div className="w-full max-w-sm mx-auto space-y-6">
            <div className="space-y-2 text-center">
              <div className="flex justify-center mb-4">
                <div className="h-12 w-12 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center">
                  <ShieldCheck className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                </div>
              </div>
              <h2 className="text-3xl font-bold tracking-tight">Güvenli Oturum Açma</h2>
              <p className="text-muted-foreground text-sm">
                Hesabınıza erişmek için bilgilerinizi girin.
              </p>
            </div>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Kullanıcı Adı</Label>
                <Input 
                  id="username" 
                  type="text" 
                  required 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)} 
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Şifre</Label>
                  <button
                    type="button"
                    onClick={() => setIsForgotPass(true)}
                    className="text-sm text-indigo-600 hover:text-indigo-500 hover:underline font-medium bg-transparent border-none p-0"
                  >
                    Şifremi Unuttum
                  </button>
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  required 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="remember" />
                <label
                  htmlFor="remember"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-muted-foreground"
                >
                  Beni Tanı
                </label>
              </div>
              <Button type="submit" disabled={isLoading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white mt-2">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Giriş Yap
              </Button>
            </form>
          </div>
        </div>

        {/* OVERLAY PANEL (Slides Left/Right) */}
        <div 
          className={cn(
            "absolute top-0 left-0 w-1/2 h-full z-10 transition-transform duration-700 ease-in-out bg-slate-900 text-white overflow-hidden shadow-2xl",
            isForgotPass ? "translate-x-full" : "translate-x-0"
          )}
        >
          {/* Background Image overlay */}
          <div className="absolute inset-0 opacity-40 mix-blend-overlay">
            <img 
               src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=1200&auto=format&fit=crop" 
               alt="Corporate Office Background" 
               className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/90 via-slate-900/80 to-transparent" />
          
          <div className="relative z-20 h-full flex flex-col items-center justify-center p-12 text-center text-white space-y-6">
             <ShieldCheck className="h-16 w-16 mb-4 text-indigo-400 opacity-90" />
             <h1 className="text-4xl font-extrabold tracking-tight">ComplyFlow Platformu</h1>
             <p className="text-lg text-slate-300 font-medium max-w-[300px] leading-relaxed">
               Hukuk ve uyumluluk ekipleri için tasarlanmış yeni nesil akıllı görev yönetim sistemi.
             </p>
             <div className="w-16 h-1 bg-indigo-500 rounded-full mt-4" />
          </div>
        </div>

      </div>
    </div>
  );
}
