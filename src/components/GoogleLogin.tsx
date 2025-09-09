"use client";
import { signIn } from "next-auth/react"
import React from 'react'
import { Button } from "./ui/button";

const GoogleLogin = ({  }) => {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const loginWithGoogle = async () => {
    setIsLoading(true);

    try {
      await signIn("google");
    } catch (error) {
      console.error("Error logging in with Google:", error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    
      <Button
        
        type="button"
        size="sm"
        className="w-full"
        onClick={loginWithGoogle}
        disabled={isLoading}
      >
        {isLoading ? null : <h1>Loading...</h1>}
        Google
      </Button>
    
  );
};

export default GoogleLogin