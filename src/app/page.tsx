"use client"
import {  KeyboardEvent,    useState } from 'react';
import { Laptop, Eye, EyeOff, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import useAuth from '@/hooks/use-auth';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import useUserStore from '@/store/useUserStore';

interface ErrorResponse {
  response: {
    data: {
      message: string;
    };
  };
}

export default function LoginPage() {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const {login}=useAuth();
  const router=useRouter();
  const {setUser}=useUserStore()

  const handleLogin = async() => {
    setError('');
    
    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }

    const payload={
      name:username,
      password
    }
    
    setIsLoading(true);


    try{
      const res=await login(payload);
      if(res.success){
        toast.success("Logged In Successfully");
        router.push("/dashboard");
        setUser(res.data.user);
        localStorage.setItem("token",res.data.token);

      }else{
        toast.error("Invalid credentials");
        setError('Invalid username or password');
      }
    }catch(error:unknown){
      if((error as ErrorResponse).response.data && (error as ErrorResponse).response.data.message){
        toast.error((error as ErrorResponse).response.data.message)
        console.log((error as ErrorResponse).response.data.message)
        setError('Invalid username or password');
      }
    }finally{
      setIsLoading(false)
    }
    
  
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };




  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50 dark:bg-gray-900">
      {/* Left side - Branding/Illustration */}
      <div className="hidden md:flex md:w-1/2 bg-blue-600 text-white p-8 flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-8">
            <Laptop size={32} />
            <h1 className="text-2xl font-bold">AssetTrack</h1>
          </div>
          <h2 className="text-3xl font-bold mb-4">IT Asset Management System</h2>
          <p className="text-blue-100 text-lg mb-6">
            Securely manage and track your organization&apos;s IT assets in one centralized platform.
          </p>
        </div>
        
        {/* Abstract graphic for visual interest */}
        <div className="relative h-64">
          <svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <circle cx="50" cy="150" r="40" fill="rgba(255,255,255,0.1)" />
            <circle cx="150" cy="120" r="70" fill="rgba(255,255,255,0.05)" />
            <circle cx="280" cy="50" r="90" fill="rgba(255,255,255,0.07)" />
            <circle cx="350" cy="180" r="30" fill="rgba(255,255,255,0.1)" />
            <path d="M20,100 Q150,20 300,120" stroke="rgba(255,255,255,0.2)" strokeWidth="4" fill="none" />
            <path d="M30,180 Q200,80 380,150" stroke="rgba(255,255,255,0.1)" strokeWidth="6" fill="none" />
          </svg>
        </div>
        
        <div className="text-sm text-blue-100">
          © 2025 AssetTrack. All rights reserved.
        </div>
      </div>
      
      {/* Right side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Mobile logo - shown only on small screens */}
          <div className="flex justify-center mb-8 md:hidden">
            <div className="flex items-center gap-2">
              <Laptop size={32} className="text-blue-600" />
              <h1 className="text-2xl font-bold">AssetTrack</h1>
            </div>
          </div>
          
          <Card className="border-0 shadow-lg">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center">Sign In</CardTitle>
              <CardDescription className="text-center">
                Enter your credentials to access the dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-4 bg-red-50 text-red-800 border border-red-200">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <div className="relative">
                    <Input
                      id="username"
                      placeholder="Enter your username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="pl-10"
                      disabled={isLoading}
                      onKeyPress={handleKeyPress}
                    />
                    <div className="absolute left-3 top-3 text-gray-400">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Button 
                      variant="link" 
                      className="p-0 h-auto text-xs font-normal text-blue-600"
                      type="button"
                    >
                      Forgot password?
                    </Button>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10"
                      disabled={isLoading}
                      onKeyPress={handleKeyPress}
                    />
                    <div className="absolute left-3 top-3 text-gray-400">
                      <Lock size={16} />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1 h-8 w-8 text-gray-400"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </Button>
                  </div>
                </div>
                
                <Button 
                  onClick={handleLogin}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing in...
                    </div>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4 text-center">
              <p className="text-sm text-gray-500 w-full">
                Secure access for authorized personnel only
              </p>
            </CardFooter>
          </Card>
          
          {/* Help text */}
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>Need help? Contact your IT department</p>
          </div>
        </div>
      </div>
    </div>
  );
}