/**
 * OSER — configuração central da marca e conteúdo da landing page.
 * Altere aqui logo, textos, contatos, redes sociais, serviços e frota.
 */
import heroImage from "@/assets/hero-executive.jpg";
import fleetExecutive from "@/assets/fleet-executive.jpg";
import fleetSuv from "@/assets/fleet-suv.jpg";
import fleetVan from "@/assets/fleet-van.jpg";
import fleetElectric from "@/assets/fleet-electric.jpg";
import serviceExecutive from "@/assets/service-executive.jpg";
import serviceEvents from "@/assets/service-events.jpg";
import serviceAirport from "@/assets/service-airport.jpg";
import serviceVip from "@/assets/service-vip.jpg";
import serviceCorporate from "@/assets/service-corporate.jpg";
import serviceOperations from "@/assets/service-operations.jpg";
import techMotion from "@/assets/tech-motion.jpg";
import ctaCity from "@/assets/cta-city.jpg";

export const brand = {
  name: "OSER",
  tagline: "Mobilidade executiva no seu ritmo.",
  description:
    "Transporte executivo, eventos e deslocamentos com conforto, segurança e gestão inteligente.",
  systemUrl: "/login",
  quoteUrl: "#contato",
};

export const nav = [
  { label: "Início", href: "#inicio" },
  { label: "Serviços", href: "#servicos" },
  { label: "Frota", href: "#frota" },
  { label: "Como funciona", href: "#como-funciona" },
  { label: "Tecnologia", href: "#tecnologia" },
  { label: "Contato", href: "#contato" },
];

export const hero = {
  image: heroImage,
  eyebrow: "Transporte executivo & gestão de deslocamentos",
  title: brand.tagline,
  text: brand.description,
  primaryCta: { label: "Solicitar cotação", href: brand.quoteUrl },
  secondaryCta: { label: "Entrar", href: brand.systemUrl },
  stats: [
    { value: "24/7", label: "Operação disponível" },
    { value: "100%", label: "Motoristas cadastrados" },
    { value: "Tempo real", label: "Acompanhamento" },
  ],
};

export const services = [
  {
    title: "Transporte Executivo",
    text: "Deslocamentos com conforto, segurança e pontualidade.",
    image: serviceExecutive,
  },
  {
    title: "Eventos",
    text: "Soluções de transporte para eventos corporativos, sociais e grandes operações.",
    image: serviceEvents,
  },
  {
    title: "Aeroportos",
    text: "Traslados executivos de chegada e saída.",
    image: serviceAirport,
  },
  {
    title: "Atendimento VIP",
    text: "Motoristas preparados para oferecer uma experiência diferenciada.",
    image: serviceVip,
  },
  {
    title: "Viagens Corporativas",
    text: "Mobilidade para executivos, reuniões e compromissos profissionais.",
    image: serviceCorporate,
  },
  {
    title: "Operações Personalizadas",
    text: "Estrutura para atender operações com múltiplos veículos e motoristas.",
    image: serviceOperations,
  },
];

/** Categorias de frota. Futuramente alimentadas pelos veículos do sistema. */
export const fleet = {
  title: "Uma frota preparada para cada ocasião.",
  categories: [
    {
      name: "Executivo",
      text: "Sedans executivos e veículos confortáveis para viagens corporativas.",
      image: fleetExecutive,
    },
    {
      name: "SUV",
      text: "Mais espaço e conforto para grupos e deslocamentos especiais.",
      image: fleetSuv,
    },
    {
      name: "Van Executiva",
      text: "Ideal para grupos, eventos e operações corporativas.",
      image: fleetVan,
    },
    {
      name: "Elétricos",
      text: "Mobilidade moderna e sustentável.",
      image: fleetElectric,
    },
  ],
};

export const steps = [
  { number: "01", title: "Solicite", text: "Entre em contato e informe sua necessidade." },
  { number: "02", title: "Planejamos", text: "Definimos veículo, motorista, horário e percurso." },
  { number: "03", title: "Acompanhamos", text: "Nossa operação acompanha cada deslocamento." },
  { number: "04", title: "Você aproveita", text: "Chegue ao seu destino com conforto e tranquilidade." },
];

export const technology = {
  title: "Tecnologia para uma operação mais inteligente.",
  text: "A OSER combina atendimento executivo com tecnologia para acompanhar cada operação, controlar deslocamentos, motoristas e quilometragem em tempo real.",
  image: techMotion,
  panel: {
    status: "Deslocamento ativo",
    event: "Evento corporativo — Hotel Unique",
    driver: "Motorista • Ricardo A.",
    vehicle: "Veículo • Sedan Executivo — Placa OSR-2024",
    start: "Saída 18:40",
    end: "Chegada prevista 19:15",
    km: "Km percorridos • 24,8",
  },
};

export const security = {
  title: "Seu deslocamento sob controle.",
  items: [
    { title: "Motoristas cadastrados", text: "Controle completo dos profissionais." },
    { title: "Veículos identificados", text: "Cada operação possui veículo associado." },
    { title: "Acompanhamento em tempo real", text: "O gestor acompanha os deslocamentos ativos." },
    { title: "Controle de quilometragem", text: "Registro da quilometragem inicial, final e total." },
    { title: "Gestão centralizada", text: "Todos os eventos em uma única plataforma." },
  ],
};

export const finalCta = {
  title: "Seu próximo deslocamento começa aqui.",
  text: "Conte com a OSER para transformar cada deslocamento em uma experiência de conforto, segurança e excelência.",
  image: ctaCity,
  primary: { label: "Solicitar cotação", href: brand.quoteUrl },
  secondary: { label: "Entrar no sistema", href: brand.systemUrl },
};

export const contact = {
  whatsapp: { label: "WhatsApp", value: "+55 (11) 90000-0000", href: "https://wa.me/5511900000000" },
  instagram: { label: "Instagram", value: "@oser", href: "https://instagram.com/oser" },
  email: { label: "E-mail", value: "contato@oser.com.br", href: "mailto:contato@oser.com.br" },
  phone: { label: "Telefone", value: "+55 (11) 3000-0000", href: "tel:+551130000000" },
  address: { label: "Endereço", value: "Av. Brigadeiro Faria Lima, 1000 — São Paulo, SP", href: "#" },
};

export const footer = {
  description: "Mobilidade executiva e soluções para eventos.",
  links: [...nav, { label: "Login", href: brand.systemUrl }],
  legal: `© ${new Date().getFullYear()} ${brand.name}. Todos os direitos reservados.`,
};
