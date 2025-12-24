
'use client';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { cn } from '@/lib/utils';
import { signInWithGoogle, signUpWithEmailAndPassword, signInWithEmailAndPassword } from '@/firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { FirebaseError } from 'firebase/app';

function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2a10 10 0 1 0 10 10" />
        <path d="M22 12A10 10 0 0 0 12 2v10z" />
      </svg>
    );
}

export const AuthCard = () => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { toast } = useToast();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(signInEmail, signInPassword);
      toast({ title: 'Success', description: 'Signed in successfully.' });
    } catch (error) {
      if (error instanceof FirebaseError) {
        toast({
          variant: 'destructive',
          title: 'Sign In Error',
          description: error.message,
        });
      }
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (signUpPassword !== confirmPassword) {
      toast({
        variant: 'destructive',
        title: 'Sign Up Error',
        description: 'Passwords do not match.',
      });
      return;
    }
    try {
      await signUpWithEmailAndPassword(signUpEmail, signUpPassword);
      toast({ title: 'Success', description: 'Account created successfully. Please sign in.' });
      setIsFlipped(false); // Flip to sign-in form
    } catch (error) {
      if (error instanceof FirebaseError) {
        toast({
          variant: 'destructive',
          title: 'Sign Up Error',
          description: error.message,
        });
      }
    }
  };

  return (
    <div className="relative w-full max-w-sm h-auto" style={{ perspective: '1000px' }}>
      <div
        className={cn('relative w-full h-full transition-transform duration-700', isFlipped ? '[transform:rotateY(180deg)]' : '')}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Sign In Form (Front) */}
        <div className="absolute w-full h-full" style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}>
          <Card>
            <CardHeader>
              <CardTitle>Sign In</CardTitle>
              <CardDescription>Welcome back! Please enter your details.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email">Email</Label>
                  <Input id="signin-email" type="email" placeholder="m@example.com" required value={signInEmail} onChange={(e) => setSignInEmail(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signin-password">Password</Label>
                  <Input id="signin-password" type="password" required value={signInPassword} onChange={(e) => setSignInPassword(e.target.value)} />
                </div>
                <Button className="w-full" type="submit">
                  Sign In
                </Button>
              </form>
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                </div>
              </div>
              <Button variant="outline" className="w-full" onClick={signInWithGoogle}>
                <GoogleIcon className="mr-2 h-4 w-4" />
                Google
              </Button>
              <p className="mt-4 text-center text-sm">
                Don't have an account?{' '}
                <button onClick={() => setIsFlipped(true)} className="font-semibold text-primary hover:underline">
                  Sign Up
                </button>
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Sign Up Form (Back) */}
        <div className="absolute w-full h-full" style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
          <Card>
            <CardHeader>
              <CardTitle>Sign Up</CardTitle>
              <CardDescription>Create an account to get started.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input id="signup-email" type="email" placeholder="m@example.com" required value={signUpEmail} onChange={(e) => setSignUpEmail(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input id="signup-password" type="password" required value={signUpPassword} onChange={(e) => setSignUpPassword(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input id="confirm-password" type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                </div>
                <Button className="w-full" type="submit">
                  Create Account
                </Button>
              </form>
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                </div>
              </div>
              <Button variant="outline" className="w-full" onClick={signInWithGoogle}>
                <GoogleIcon className="mr-2 h-4 w-4" />
                Google
              </Button>
              <p className="mt-4 text-center text-sm">
                Already have an account?{' '}
                <button onClick={() => setIsFlipped(false)} className="font-semibold text-primary hover:underline">
                  Sign In
                </button>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
