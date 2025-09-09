"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Wallet, Menu, X, User, LogIn, LogOut } from "lucide-react"; // Added LogOut
import { signOut } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export default function Navbar({
  email,
  name,
  image,
}: {
  email?: string;
  name?: string;
  image?: string;
}) {

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  
  const isLoggedIn = email || name || image;

  return (
    <nav className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
       
          <Link
            href="/"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <Wallet className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">
              ExpenseTracker
            </span>
          </Link>

         
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              Home
            </Link>
            <Link
              href="#features"
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              Features
            </Link>
            <Link
              href="#about"
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              About
            </Link>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Avatar>
                   
                    <AvatarImage
                      src={image || ""}
                      alt={name || "User Avatar"}
                    />
                    <AvatarFallback>
                      {name ? name.charAt(0) : "U"}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white" align="end">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      {name && <p className="font-medium">{name}</p>}
                      {email && (
                        <p className="w-[200px] truncate text-sm text-muted-foreground">
                          {email}
                        </p>
                      )}
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  {/* Changed Feed to Dashboard as it's more common */}
                  <DropdownMenuItem asChild>
                    <Link href={`/dashboard/${name}`}>Dashboard</Link>
                  </DropdownMenuItem>

                  {/* Removed "Create Community" as it might not be relevant for all users */}
                  <DropdownMenuItem asChild>
                    <Link href="/settings">Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onSelect={(event) => {
                      event.preventDefault();
                      signOut({
                        callbackUrl: `${window.location.origin}/sign-in`,
                      });
                    }}
                  >
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              // Not logged in: Show Sign In button
              <Link href="/sign-in">
                <Button
                  variant="ghost"
                  className="justify-start text-gray-600 hover:text-blue-600"
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  Sign In
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={toggleMenu}
          >
            {isMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="flex flex-col gap-4">
              <Link
                href="/"
                className="text-gray-600 hover:text-blue-600 transition-colors py-2"
                onClick={toggleMenu} // Close menu on link click
              >
                Home
              </Link>
              <Link
                href="#features"
                className="text-gray-600 hover:text-blue-600 transition-colors py-2"
                onClick={toggleMenu}
              >
                Features
              </Link>
              <Link
                href="#about"
                className="text-gray-600 hover:text-blue-600 transition-colors py-2"
                onClick={toggleMenu}
              >
                About
              </Link>
            

              <div className="flex flex-col gap-2 pt-4 border-t border-gray-200">
                {isLoggedIn ? (
                  <>
                    
                    <Link href="/dashboard" onClick={toggleMenu}>
                      <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                        <User className="h-4 w-4 mr-2" />
                        Dashboard
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      className="justify-start text-gray-600 hover:text-blue-600"
                      onClick={() => {
                        toggleMenu(); // Close mobile menu first
                        signOut({
                          callbackUrl: `${window.location.origin}/sign-in`,
                        });
                      }}
                    >
                      <LogOut className="h-4 w-4 mr-2" />{" "}
                      {/* Use LogOut icon */}
                      Sign out
                    </Button>
                  </>
                ) : (
                  // Not logged in: Show Sign In
                  <Link href="/sign-in" onClick={toggleMenu}>
                    <Button
                      variant="ghost"
                      className="justify-start text-gray-600 hover:text-blue-600"
                    >
                      <LogIn className="h-4 w-4 mr-2" />
                      Sign In
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
