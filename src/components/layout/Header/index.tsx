import { Menu, } from 'lucide-react';
import { ThemeToggle } from '@/components/layout/ThemeToggle';

interface HeaderProps {
  title: string;
  onMenuClick: () => void;
  isMenuOpen: boolean;
}

export function Header({ title, onMenuClick, isMenuOpen }: HeaderProps) {
  return (
    <header className="sticky top-0 z-20 h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 sm:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
          aria-label="Abrir menu"
          aria-expanded={isMenuOpen}
          aria-controls="primary-navigation"
        >
          <Menu className="w-5 h-5" aria-hidden="true" />
        </button>
        <h1 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h1>
      </div>
      <div className="flex items-center gap-2">
        <div
          className="relative p-2 rounded-lg text-gray-600 dark:text-gray-400"
          aria-hidden="true"
        >
        </div>
        <ThemeToggle />
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-sm font-semibold ml-1">
          <span aria-hidden="true">A</span>
        </div>
      </div>
    </header>
  );
}
