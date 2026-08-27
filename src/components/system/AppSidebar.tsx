import { Link, useRouterState } from "@tanstack/react-router";
import {
  BarChart3,
  CalendarDays,
  Car,
  LayoutDashboard,
  Route as RouteIcon,
  Settings,
  UserRound,
  Users,
  Wallet,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { brand } from "@/config/site";

const operacao = [
  { title: "Dashboard", url: "/painel", icon: LayoutDashboard },
  { title: "Viagens", url: "/viagens", icon: RouteIcon },
  { title: "Agenda", url: "/agenda", icon: CalendarDays },
];

const cadastros = [
  { title: "Clientes", url: "/clientes", icon: Users },
  { title: "Motoristas", url: "/motoristas", icon: UserRound },
  { title: "Frota", url: "/frota", icon: Car },
];

const gestao = [
  { title: "Financeiro", url: "/financeiro", icon: Wallet },
  { title: "Relatórios", url: "/relatorios", icon: BarChart3 },
  { title: "Configurações", url: "/configuracoes", icon: Settings },
];

export function AppSidebar() {
  const currentPath = useRouterState({ select: (r) => r.location.pathname });

  const renderGroup = (label: string, items: typeof operacao) => (
    <SidebarGroup>
      <SidebarGroupLabel className="text-[0.65rem] tracking-[0.2em] uppercase">
        {label}
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.url}>
              <SidebarMenuButton asChild isActive={currentPath === item.url} tooltip={item.title}>
                <Link to={item.url} className="flex items-center gap-2">
                  <item.icon className="size-4" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border px-4 py-4">
        <Link to="/" className="wordmark text-base text-sidebar-foreground">
          {brand.name}
        </Link>
      </SidebarHeader>
      <SidebarContent>
        {renderGroup("Operação", operacao)}
        {renderGroup("Cadastros", cadastros)}
        {renderGroup("Gestão", gestao)}
      </SidebarContent>
    </Sidebar>
  );
}
