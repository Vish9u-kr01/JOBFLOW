"use client"

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Briefcase, LayoutDashboard, User, LogOut, LogIn } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useApp } from '@/lib/store/app-context';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function MainNav() {
  const pathname = usePathname();
  const { profile, logout, isLoadingAuth } = useApp();

  const routes = [
    { name: 'Feed', href: '/', icon: Briefcase },
    { name: 'Applications', href: '/applications', icon: LayoutDashboard },
    { name: 'Profile', href: '/profile', icon: User },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-16 bg-background/80 backdrop-blur-xl border-b border-white/5 nav-glow">
      <div className="container mx-auto h-full px-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative">
            <div className="absolute inset-0 bg-violet-500/20 blur-lg group-hover:bg-violet-500/30 transition-all rounded-full" />
            <div className="relative z-10 w-10 h-10 vibrant-bg rounded-lg flex items-center justify-center transition-transform group-hover:scale-110 shadow-lg shadow-violet-500/20">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
          </div>
          <span className="text-xl font-black tracking-tighter text-white">JobFlow</span>
        </Link>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2">
            {routes.map((route) => {
              const Icon = route.icon;
              const isActive = pathname === route.href;
              return (
                <Link 
                  key={route.href} 
                  href={route.href}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-full transition-all text-sm font-bold",
                    isActive 
                      ? "bg-primary/10 text-primary border border-primary/20" 
                      : "text-muted-foreground hover:text-white hover:bg-white/5"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span>{route.name}</span>
                </Link>
              );
            })}
          </div>

          <div className="h-6 w-px bg-white/10 mx-2 hidden md:block" />

          {!isLoadingAuth && (
            profile ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
                    <Avatar className="h-10 w-10 border border-white/10 hover:border-primary/50 transition-colors">
                      <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.email}`} alt={profile.name} />
                      <AvatarFallback className="bg-primary text-primary-foreground">{profile.name?.[0] || 'U'}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-card border-white/10 text-white" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-bold leading-none">{profile.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {profile.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer focus:bg-white/10 focus:text-white">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/applications" className="cursor-pointer focus:bg-white/10 focus:text-white">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      <span>Applications</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem onClick={() => logout()} className="text-primary cursor-pointer focus:bg-primary/10 focus:text-primary">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild className="bg-primary text-white hover:bg-primary/90 rounded-full font-bold px-6 shadow-lg shadow-primary/20">
                <Link href="/login">
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In
                </Link>
              </Button>
            )
          )}
        </div>
      </div>
    </nav>
  );
}