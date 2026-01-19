import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Menu as MenuIcon,
  Users,
  Bell,
  UserCircle,
  LogOut,
  ChevronLeft,
  Settings,
  Moon,
  Sun,
  Globe,
  Check
} from "lucide-react";
import logo from "@/assets/logo.png";

// Redux Imports
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { toggleTheme, setLanguage } from "@/redux/features/settings/settingsSlice";
import { logout } from "@/redux/features/auth/authSlice";

// Shadcn UI Imports
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

// Navigation Items Type
type NavItem = {
  to: string;
  label: string;
  icon: React.ElementType;
};

const nav: NavItem[] = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/organization", label: "Organization", icon: Users },
];

export default function AdminAppLayout() {
  const [open, setOpen] = useState<boolean>(false); // Closed by default on mobile
  const sidebarRef = useRef<HTMLElement>(null);
  const navigate = useNavigate();

  // Auto-open sidebar on desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setOpen(true);
      } else {
        setOpen(false);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Redux State
  const dispatch = useAppDispatch();
  const { theme, language } = useAppSelector((state) => state.settings);

  // Sync theme with document
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Sync language with document
  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  // Close sidebar when clicking outside (mobile only)
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(e.target as Node) &&
        open &&
        window.innerWidth < 1024
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/admin/login");
  };

  // Framer Motion Variants
  const sidebarVariants = {
    expanded: { width: "16rem" }, // w-64
    collapsed: { width: "5rem" }, // w-20
  };

  const textVariants = {
    expanded: { opacity: 1, x: 0, display: "block" },
    collapsed: { opacity: 0, x: -10, transitionEnd: { display: "none" } },
  };

  return (
    <div className="min-h-screen flex bg-gray-50 text-gray-900 dark:bg-zinc-950 dark:text-zinc-100 transition-colors duration-300">
      
      {/* Sidebar */}
      <motion.aside
        ref={sidebarRef}
        initial={false}
        animate={open ? "expanded" : "collapsed"}
        variants={sidebarVariants}
        transition={{ duration: 0.3, type: "spring", stiffness: 100, damping: 15 }}
        className={`fixed lg:sticky top-0 h-screen bg-[#F1F5F9] dark:bg-zinc-900 border-r border-gray-200 dark:border-zinc-800 shadow-lg lg:shadow-sm z-30 flex flex-col overflow-hidden ${!open && 'lg:flex hidden '}`}
        style={{ left: open || window.innerWidth >= 1024 ? 0 : '-100%' }}
      >
        {/* Header / Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-zinc-800">
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-center flex-1"
              >
                <img src={logo} alt="CUL Logo" className="h-10 w-auto object-contain" />
              </motion.div>
            )}
          </AnimatePresence>
          
          <button
            onClick={() => setOpen(!open)}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-600 dark:text-zinc-400 transition-colors"
            aria-label="Toggle sidebar"
          >
            {open ? <ChevronLeft size={20} /> : <MenuIcon size={20} />}
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {nav.map((Item) => (
            <NavLink
              key={Item.to}
              to={Item.to}
              className={({ isActive }) =>
                `relative group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 overflow-hidden whitespace-nowrap
                ${
                  isActive
                    ? "bg-pink-50 text-pink-600 dark:bg-pink-900/20 dark:text-pink-400 font-medium"
                    : "text-gray-600 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800 hover:text-gray-900 dark:hover:text-zinc-100"
                }`
              }
            >
              <Item.icon className="w-5 h-5 shrink-0" />
              
              <motion.span
                variants={textVariants}
                transition={{ duration: 0.2 }}
                className="whitespace-nowrap"
              >
                {Item.label}
              </motion.span>

              {/* Tooltip for collapsed state */}
              {!open && (
                <div className="absolute left-14 z-50 ml-2 px-2 py-1 rounded bg-gray-900 dark:bg-zinc-700 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-md">
                  {Item.label}
                </div>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer / Logout */}
        <div className="p-3 border-t border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors group overflow-hidden"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            <motion.span variants={textVariants} className="whitespace-nowrap font-medium">
              Logout
            </motion.span>
          </button>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
        
        {/* Top Header */}
        <header className="sticky top-0 z-10 h-16 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-gray-200 dark:border-zinc-800 flex items-center justify-between px-4 sm:px-6 shadow-sm">
          <div className="flex items-center gap-3">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setOpen(!open)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-600 dark:text-zinc-400 transition-colors"
              aria-label="Toggle menu"
            >
              <MenuIcon size={20} />
            </button>
            <div className="font-semibold text-base sm:text-lg text-gray-800 dark:text-zinc-100">
              Welcome back 👋
            </div>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Settings Dropdown (Theme & Language) */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800">
                  <Settings className="w-5 h-5 text-gray-600 dark:text-zinc-400" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 dark:bg-zinc-900 dark:border-zinc-800">
                <DropdownMenuLabel>Appearance</DropdownMenuLabel>
                <DropdownMenuSeparator className="dark:bg-zinc-800" />
                
                {/* Theme Toggle */}
                <DropdownMenuItem onClick={() => dispatch(toggleTheme())} className="cursor-pointer">
                   {theme === 'dark' ? <Sun className="mr-2 h-4 w-4" /> : <Moon className="mr-2 h-4 w-4" />}
                   <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                </DropdownMenuItem>

                {/* Language Submenu */}
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger className="cursor-pointer">
                    <Globe className="mr-2 h-4 w-4" />
                    <span>Language ({language.toUpperCase()})</span>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent className="dark:bg-zinc-900 dark:border-zinc-800">
                    <DropdownMenuItem onClick={() => dispatch(setLanguage('en'))} className="cursor-pointer">
                      <span>English</span>
                      {language === 'en' && <Check className="ml-auto h-4 w-4" />}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => dispatch(setLanguage('ar'))} className="cursor-pointer">
                      <span>Arabic</span>
                      {language === 'ar' && <Check className="ml-auto h-4 w-4" />}
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Notifications */}
            <NavLink
              to="/notifications"
              className={({ isActive }) =>
                `p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors ${
                  isActive ? "text-pink-600 dark:text-pink-400" : "text-gray-500 dark:text-zinc-400"
                }`
              }
            >
              <Bell className="w-5 h-5 sm:w-6 sm:h-6" />
            </NavLink>
            
            {/* Profile */}
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                `p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors ${
                  isActive ? "text-pink-600 dark:text-pink-400" : "text-gray-500 dark:text-zinc-400"
                }`
              }
            >
              <UserCircle className="w-6 h-6 sm:w-7 sm:h-7" />
            </NavLink>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-3 sm:p-4 md:p-6 overflow-x-hidden">
          <Outlet />
        </main>
      </div>

      {/* Overlay for mobile when sidebar is open */}
      {open && (
        <div 
          className="fixed inset-0 bg-black/30 z-20 lg:hidden backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}
    </div>
  );
}