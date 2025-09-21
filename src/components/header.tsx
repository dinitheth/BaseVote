'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, Moon, Sun, X } from 'lucide-react';
import { Badge } from './ui/badge';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { useWallet } from '@/context/wallet-context';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

export function Header() {
  const { theme, setTheme } = useTheme();
  const { account, connectWallet } = useWallet();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/main', label: 'Main' },
    { href: '/create', label: 'Create' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-3">
             <h1 className="text-2xl font-bold tracking-tighter font-headline">
              Base<span className="text-primary">Vote</span>
            </h1>
          </Link>
          <nav className="hidden md:flex items-center gap-4 text-sm font-medium text-muted-foreground">
            {navLinks.map(link => (
              <Link key={link.href} href={link.href} className="transition-colors hover:text-foreground">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className='flex items-center gap-2 md:gap-4'>
          <Badge variant="secondary" className='hidden sm:flex items-center gap-2'>
            <div className="h-2 w-2 rounded-full bg-green-500"></div>
            Base Mainnet
          </Badge>
          <Button variant="ghost" size="icon" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
          <div className="hidden md:block">
            <Button onClick={connectWallet} disabled={!!account} className="font-bold">
              {account ? truncateAddress(account) : 'Connect Wallet'}
            </Button>
          </div>
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full max-w-xs bg-background p-0">
              <div className="flex flex-col h-full">
                <SheetHeader className="flex flex-row items-center justify-between p-4 border-b">
                   <Link href="/" className="flex items-center gap-3" onClick={() => setIsMobileMenuOpen(false)}>
                    <h1 className="text-2xl font-bold tracking-tighter font-headline">
                      Base<span className="text-primary">Vote</span>
                    </h1>
                  </Link>
                  <SheetTitle className="sr-only">Menu</SheetTitle>
                  <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
                    <X className="h-5 w-5" />
                    <span className="sr-only">Close menu</span>
                  </Button>
                </SheetHeader>
                <nav className="flex flex-col gap-4 p-4 text-lg font-medium">
                  {navLinks.map(link => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="text-muted-foreground transition-colors hover:text-foreground"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
                <div className="mt-auto p-4 border-t">
                  <Button onClick={connectWallet} disabled={!!account} className="w-full font-bold">
                    {account ? truncateAddress(account) : 'Connect Wallet'}
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
