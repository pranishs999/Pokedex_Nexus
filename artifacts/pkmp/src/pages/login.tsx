import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLocation, Link } from 'wouter';
import { motion } from 'framer-motion';
import { useLogin, type LoginInput } from '@workspace/api-client-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { PageTransition } from '@/components/shared/PageTransition';
import { Loader2 } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export default function Login() {
  const [, setLocation] = useLocation();
  const { isAuthenticated } = useAuth();
  const loginMutation = useLogin();

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  // Redirect if already logged in
  React.useEffect(() => {
    if (isAuthenticated) {
      setLocation('/profile');
    }
  }, [isAuthenticated, setLocation]);

  const onSubmit = (data: LoginInput) => {
    loginMutation.mutate({ data }, {
      onSuccess: () => {
        toast.success("Welcome back to the Pokédex!");
        window.location.href = '/'; 
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || "Invalid credentials. Please try again.");
      }
    });
  };

  return (
    <PageTransition className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-8 md:p-10 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden"
        >
          {/* Subtle glow */}
          <div className="absolute -top-32 -right-32 w-64 h-64 bg-primary/20 blur-[100px] rounded-full pointer-events-none" />
          
          <div className="text-center mb-8 relative z-10">
            <div className="w-16 h-16 mx-auto rounded-full bg-primary flex items-center justify-center mb-6 relative overflow-hidden">
              <div className="absolute top-1/2 w-full h-[3px] bg-black -translate-y-1/2" />
              <div className="absolute top-1/2 left-1/2 w-5 h-5 bg-black rounded-full -translate-x-1/2 -translate-y-1/2 border-[3px] border-primary" />
            </div>
            <h1 className="text-3xl font-heading font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-muted-foreground">Access your favorites and custom lists.</p>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 relative z-10">
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/80">Email</label>
              <input
                {...form.register('email')}
                type="email"
                className="w-full h-12 bg-black/40 border border-white/10 rounded-xl px-4 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                placeholder="trainer@example.com"
              />
              {form.formState.errors.email && (
                <p className="text-sm text-destructive mt-1">{form.formState.errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white/80">Password</label>
              <input
                {...form.register('password')}
                type="password"
                className="w-full h-12 bg-black/40 border border-white/10 rounded-xl px-4 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                placeholder="••••••••"
              />
              {form.formState.errors.password && (
                <p className="text-sm text-destructive mt-1">{form.formState.errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full h-12 mt-6 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(255,204,0,0.2)] hover:shadow-[0_0_25px_rgba(255,204,0,0.4)] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loginMutation.isPending ? <Loader2 className="animate-spin" size={20} /> : 'Login'}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-muted-foreground relative z-10">
            Don't have an account?{' '}
            <Link href="/register" className="text-primary font-medium hover:underline">
              Register here
            </Link>
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
}
