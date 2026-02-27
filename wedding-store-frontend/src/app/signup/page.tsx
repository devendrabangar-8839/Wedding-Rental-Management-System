'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck, User as UserIcon, Lock, Mail, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (password !== passwordConfirmation) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      const response = await api.post('/register', {
        email,
        password,
        password_confirmation: passwordConfirmation,
      });
      login(response.data.token, response.data.user);
      router.push('/');
    } catch (err: any) {
      setError(err.response?.data?.details || err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--tw-gradient-from)_0%,transparent_70%)] from-primary/5 -z-10" />

      <Card className="w-full max-w-md rounded-[3rem] border-none shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] overflow-hidden bg-background">
        <div className="bg-primary px-10 py-12 text-primary-foreground relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12">
            <ShieldCheck className="w-32 h-32" />
          </div>
          <CardHeader className="p-0 space-y-2">
            <CardTitle className="text-4xl font-black tracking-tighter uppercase">Create <br /> Account</CardTitle>
            <CardDescription className="text-primary-foreground/70 font-medium italic">Join us to start your rental journey.</CardDescription>
          </CardHeader>
        </div>

        <form onSubmit={handleSubmit}>
          <CardContent className="p-10 space-y-5">
            {error && (
              <div className="p-4 rounded-xl bg-destructive/5 text-destructive text-xs font-black uppercase tracking-widest border border-destructive/10">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Email Address</Label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/30 group-focus-within:text-primary transition-colors" />
                <Input
                  type="email"
                  placeholder="name@example.com"
                  className="pl-12 h-14 rounded-2xl border-none bg-secondary/5 font-bold focus:bg-background transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Password</Label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/30 group-focus-within:text-primary transition-colors" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="pl-12 pr-12 h-14 rounded-2xl border-none bg-secondary/5 font-bold focus:bg-background transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/30 hover:text-primary transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Confirm Password</Label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/30 group-focus-within:text-primary transition-colors" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="pl-12 h-14 rounded-2xl border-none bg-secondary/5 font-bold focus:bg-background transition-all"
                  value={passwordConfirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                  required
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="px-10 pb-6 pt-0 flex flex-col gap-4">
            <Button
              type="submit"
              className="w-full h-20 rounded-2xl text-xl font-black shadow-2xl shadow-primary/20 hover:scale-102 active:scale-98 transition-all"
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>
            <div className="text-center text-sm">
              <span className="text-muted-foreground font-medium">Already have an account?</span>{' '}
              <Link href="/login" className="text-primary font-black hover:underline">
                Sign In
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
