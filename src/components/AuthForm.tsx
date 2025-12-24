'use client';
import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { signInWithGoogle, signUpWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordReset } from '@/firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { FirebaseError } from 'firebase/app';
import Logo from './Logo';
import Image from 'next/image';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import Link from 'next/link';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useRouter } from 'next/navigation';

function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
      <svg
        {...props}
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M22.56 12.25C22.56 11.42 22.49 10.62 22.35 9.84H12V14.48H18.18C17.93 16.03 17.17 17.37 16.01 18.25V21.09H19.92C21.66 19.39 22.56 17.02 22.56 14.25V12.25Z" fill="#4285F4"/>
        <path d="M12 23C15.17 23 17.84 21.95 19.92 20.09L16.01 17.25C14.95 17.95 13.58 18.38 12 18.38C9.18 18.38 6.82 16.53 5.86 13.97H1.84V16.91C3.87 20.94 7.6 23 12 23Z" fill="#34A853"/>
        <path d="M5.86 13.97C5.66 13.36 5.54 12.69 5.54 12C5.54 11.31 5.66 10.64 5.86 10.03V7.09H1.84C1.09 8.64 0.62 10.26 0.62 12C0.62 13.74 1.09 15.36 1.84 16.91L5.86 13.97Z" fill="#FBBC05"/>
        <path d="M12 5.62C13.66 5.62 15.21 6.2 16.34 7.27L20.01 3.91C17.84 1.87 15.17 1 12 1C7.6 1 3.87 3.06 1.84 7.09L5.86 10.03C6.82 7.47 9.18 5.62 12 5.62Z" fill="#EA4335"/>
      </svg>
    );
}

export const AuthForm = () => {
  const [view, setView] = useState<'signIn' | 'signUp' | 'forgotPassword'>('signIn');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const loginImage = PlaceHolderImages.find(p => p.id === 'login-bg');

  const handleAuthSuccess = () => {
    toast({ title: 'Success', description: 'Redirecting to your dashboard...' });
    router.push('/dashboard');
  };

  const handleAuthError = (error: any) => {
    setIsLoading(false);
    let title = 'Authentication Error';
    if(view === 'signUp') title = 'Sign Up Error';
    if(view === 'signIn') title = 'Sign In Error';

    let description = 'An unknown error occurred. Please try again.';

    if (error instanceof FirebaseError) {
      description = error.message.replace('Firebase: ', '');
      if (error.code === 'auth/invalid-credential') {
        description = 'Invalid email or password. Please try again.';
      }
    }

    toast({
      variant: 'destructive',
      title: title,
      description: description,
    });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (view === 'forgotPassword') {
        try {
            await sendPasswordReset(email);
            toast({
                title: 'Password Reset Email Sent',
                description: 'Please check your inbox to reset your password.'
            });
            setView('signIn');
        } catch (error) {
            handleAuthError(error);
        } finally {
            setIsLoading(false);
        }
        return;
    }

    try {
      if (view === 'signUp') {
        if (password !== confirmPassword) {
          toast({ variant: 'destructive', title: 'Sign Up Error', description: 'Passwords do not match.' });
          setIsLoading(false);
          return;
        }
        await signUpWithEmailAndPassword(email, password);
        handleAuthSuccess();
      } else {
        await signInWithEmailAndPassword(email, password);
        handleAuthSuccess();
      }
    } catch (error) {
      handleAuthError(error);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signInWithGoogle();
      handleAuthSuccess();
    } catch (error) {
      handleAuthError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderFormContent = () => {
      if (view === 'forgotPassword') {
          return (
              <>
                <h2 className="text-2xl font-bold mb-1">Reset Password</h2>
                <p className="text-muted-foreground text-sm mb-6">
                    Enter your email to receive a password reset link. Or{' '}
                    <button onClick={() => setView('signIn')} className="font-semibold text-primary hover:underline" disabled={isLoading}>
                    return to login.
                    </button>
                </p>
                <form onSubmit={handleFormSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="you@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} disabled={isLoading} />
                    </div>
                    <Button className="w-full" type="submit" disabled={isLoading}>
                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        {isLoading ? 'Sending...' : 'Send Reset Link'}
                    </Button>
                </form>
              </>
          )
      }

      const isSignUp = view === 'signUp';
      const formTitle = isSignUp ? 'Create an Account' : 'Login to SkillHub';
      const formDescription = isSignUp ? 'Already have an account?' : "Don't have an account?";
      const linkText = isSignUp ? 'Login now' : 'Create one now';
      const buttonText = isSignUp ? 'Create Account' : 'Login';

      return (
        <>
            <h2 className="text-2xl font-bold mb-1">{formTitle}</h2>
            <p className="text-muted-foreground text-sm mb-6">
                {formDescription}{' '}
                <button onClick={() => setView(isSignUp ? 'signIn' : 'signUp')} className="font-semibold text-primary hover:underline" disabled={isLoading}>
                    {linkText}
                </button>
            </p>

            <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="you@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} disabled={isLoading} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} disabled={isLoading}/>
                </div>
                {isSignUp && (
                    <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <Input id="confirm-password" type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} disabled={isLoading} />
                    </div>
                )}
                {!isSignUp && (
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <Checkbox id="remember-me" disabled={isLoading} />
                            <Label htmlFor="remember-me" className="text-sm font-normal">Remember me</Label>
                        </div>
                        <button type="button" onClick={() => setView('forgotPassword')} className="text-sm text-primary hover:underline" disabled={isLoading}>
                            Forgot password?
                        </button>
                    </div>
                )}
                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" type="submit" disabled={isLoading}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    {isLoading ? 'Processing...' : buttonText}
                </Button>
            </form>

            <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">OR</span>
            </div>
            </div>

            <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <GoogleIcon className="mr-2 h-4 w-4" />}
            Sign in with Google
            </Button>
        </>
      )
  }

  return (
    <div className="w-full max-w-4xl mx-auto bg-card text-card-foreground rounded-2xl shadow-2xl overflow-hidden grid md:grid-cols-2">
      <div className="relative p-8 md:p-12 text-primary-foreground hidden md:block">
        {loginImage && 
            <Image 
                src={loginImage.imageUrl} 
                alt={loginImage.description} 
                data-ai-hint={loginImage.imageHint} 
                fill 
                className="object-cover" 
            />
        }
        <div className="relative z-10 flex flex-col justify-between h-full">
            <div>
                <Button variant="ghost" asChild className="hover:bg-white/20">
                    <Link href="/"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Home</Link>
                </Button>
                <div className="mt-8">
                    <Logo showText={false} size="lg" />
                </div>
            </div>
            <div className="mt-auto">
                <h2 className="text-3xl font-bold">Welcome Back</h2>
                <p className="mt-2 text-primary-foreground/80">
                    Login to continue your learning journey and connect with our community.
                </p>
            </div>
        </div>
      </div>
      <div className="p-8 md:p-12 flex flex-col justify-center">
        {renderFormContent()}
      </div>
    </div>
  );
};
