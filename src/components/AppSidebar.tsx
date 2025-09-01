
import { Home, Calendar, Info, BookOpen, Package, Menu } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";

const items = [
  { title: "Início", url: "/", icon: Home },
  { title: "Agenda", url: "/agenda", icon: Calendar },
  { title: "Orçamento", url: "/orcamento", icon: Package },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;

  const scrollToSection = (sectionId: string) => {
    if (location.pathname !== '/') {
      window.location.href = `/#${sectionId}`;
      return;
    }
    
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80;
      const elementPosition = element.offsetTop - offset;
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <Sidebar className="bg-black border-r border-white/20 overflow-hidden transition-[width,opacity,transform] duration-300 ease-in-out will-change-[transform] will-change-[width]">
      <SidebarHeader className="p-6 border-b border-white/20 transition-all duration-300">
        <div className="flex items-center space-x-3 transition-all duration-300">
          <img 
            src="/lovable-uploads/eb380cca-838b-43ec-bfa7-bc6677ac5149.png" 
            alt="Twins Drinks Logo" 
            className="h-8 w-8 object-contain"
          />
          {state === "expanded" && (
            <span className="text-lg font-light text-white tracking-wider animate-fade-in transition-all duration-300">
              TWINS DRINKS
            </span>
          )}
        </div>
      </SidebarHeader>
      
      <SidebarContent className="bg-black transition-all duration-300 ease-in-out animate-fade-in">
        <SidebarGroup>
          <SidebarGroupLabel className="text-white/70 text-xs uppercase tracking-widest">
            {state === "expanded" ? "Navegação" : "Nav"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild
                    isActive={isActive(item.url)}
                    className={`hover:bg-white/10 text-white transition-all duration-300 ease-in-out hover:scale-105 ${
                      isActive(item.url) 
                        ? 'bg-white/20 text-white font-medium border-l-2 border-white shadow-glow' 
                        : 'hover:bg-white/10'
                    }`}
                  >
                    <NavLink to={item.url}>
                      <item.icon className={`h-4 w-4 ${isActive(item.url) ? 'text-white' : 'text-white/70'}`} />
                      {state === "expanded" && (
                        <span className={`transition-all duration-300 ${isActive(item.url) ? 'text-white' : 'text-white/90'}`}>
                          {item.title}
                        </span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {location.pathname === '/' && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-white/70 text-xs uppercase tracking-widest">
              {state === "expanded" ? "Seções" : "Sec"}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    onClick={() => scrollToSection('about')}
                     className="hover:bg-white/10 text-white/90 transition-all duration-300 ease-in-out cursor-pointer hover:scale-105"
                  >
                    <Info className="h-4 w-4 text-white/70" />
                    {state === "expanded" && <span className="transition-all duration-300">Sobre</span>}
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    onClick={() => scrollToSection('eventos')}
                     className="hover:bg-white/10 text-white/90 transition-all duration-300 ease-in-out cursor-pointer hover:scale-105"
                  >
                    <Calendar className="h-4 w-4 text-white/70" />
                    {state === "expanded" && <span className="transition-all duration-300">Eventos</span>}
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    onClick={() => scrollToSection('blog')}
                    className="hover:bg-white/10 text-white/90 transition-all duration-300 ease-in-out cursor-pointer hover:scale-105"
                  >
                    <BookOpen className="h-4 w-4 text-white/70" />
                    {state === "expanded" && <span className="transition-all duration-300">Blog</span>}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
