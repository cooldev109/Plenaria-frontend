import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, BookOpen, MessageCircle, Database, Users, Shield, Award, Globe } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageToggle from "@/components/LanguageToggle";
import heroImage from "@/assets/hero-image.jpg";
import consultationImage from "@/assets/consultation-image.jpg";
import databaseImage from "@/assets/database-image.jpg";
import educationImage from "@/assets/education-image.jpg";

const LandingPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { language, t } = useLanguage();
  
  const content = {
    pt: {
      navFeatures: "Recursos",
      navPricing: "Planos", 
      navAbout: "Sobre",
      login: "Entrar",
      start: "Começar Agora",
      hero: {
        badge: "Assessoria Jurídica Especializada",
        title: "Orientação Jurídica",
        subtitle: "para Agentes Políticos",
        description: "Plataforma completa com banco de projetos, consultoria especializada e cursos de capacitação para vereadores e agentes políticos. Tudo que você precisa em um só lugar.",
        cta1: "Começar Teste Gratuito",
        cta2: "Ver Demonstração"
      },
      video: {
        title: "Veja a LegalGov em Ação",
        description: "Descubra como nossa plataforma pode transformar sua atuação política com nosso tour interativo.",
        demoTitle: "Demonstração Interativa",
        demoSubtitle: "Clique para assistir ao tour da plataforma",
        videoNotSupported: "Seu navegador não suporta vídeos HTML5."
      },
      features: {
        title: "Tudo que você precisa em uma plataforma",
        description: "Oferecemos uma solução completa para agentes políticos, com recursos especializados para otimizar seu trabalho e garantir conformidade legal.",
        database: {
          title: "Banco de Projetos",
          description: "Acesso a milhares de projetos de lei organizados por categoria, com modelos personalizáveis e atualizados conforme a legislação vigente.",
          alt: "Banco de projetos digitais organizados"
        },
        consultation: {
          title: "Consultoria Especializada", 
          description: "Consultas diretas com especialistas em direito público e político. Orientação personalizada para suas demandas específicas.",
          alt: "Consultoria jurídica especializada"
        },
        education: {
          title: "Capacitação",
          description: "Cursos e treinamentos especializados para aprimorar suas competências e manter-se atualizado com as melhores práticas.",
          alt: "Plataforma de capacitação e cursos"
        }
      },
      pricing: {
        title: "Planos pensados para você",
        description: "Escolha o plano ideal para suas necessidades. Todos incluem suporte especializado.",
        plans: {
          basic: {
            name: "Básico",
            price: "R$ 150",
            period: "/mês",
            description: "Ideal para iniciantes",
            features: [
              "Acesso completo ao banco de projetos",
              "3 consultas mensais", 
              "Suporte por email"
            ],
            cta: "Começar Agora"
          },
          plus: {
            name: "Plus",
            price: "R$ 300", 
            period: "/mês",
            description: "Para profissionais ativos",
            popular: "Popular",
            features: [
              "Tudo do plano Básico",
              "5 consultas mensais",
              "Prioridade no atendimento",
              "Modelos personalizáveis"
            ],
            cta: "Começar Agora"
          },
          complete: {
            name: "Completo",
            price: "Sob consulta",
            description: "Solução completa",
            features: [
              "Tudo do plano Plus",
              "Consultas ilimitadas",
              "Acesso aos cursos",
              "Suporte prioritário 24/7",
              "Consultoria personalizada"
            ],
            cta: "Entrar em Contato"
          }
        }
      },
      stats: {
        title: "Números que impressionam",
        clients: {
          number: "500+",
          label: "Clientes Ativos"
        },
        projects: {
          number: "10.000+", 
          label: "Projetos Disponíveis"
        },
        consultations: {
          number: "50.000+",
          label: "Consultas Realizadas"
        },
        satisfaction: {
          number: "98%",
          label: "Satisfação dos Clientes"
        }
      },
      footer: {
        company: "LegalGov",
        description: "Transformando a assessoria jurídica política com tecnologia e expertise especializada.",
        rights: "Todos os direitos reservados.",
        links: {
          product: "Produto",
          company: "Empresa", 
          support: "Suporte"
        },
        productLinks: [
          "Banco de Projetos",
          "Consultoria", 
          "Capacitação",
          "Preços"
        ],
        companyLinks: [
          "Sobre Nós",
          "Nossa Equipe",
          "Carreiras",
          "Contato"
        ],
        supportLinks: [
          "Central de Ajuda",
          "Documentação",
          "Status",
          "Política de Privacidade"
        ]
      }
    },
    en: {
      navFeatures: "Features",
      navPricing: "Pricing",
      navAbout: "About", 
      login: "Login",
      start: "Get Started",
      hero: {
        badge: "Specialized Legal Advisory",
        title: "Legal Guidance",
        subtitle: "for Political Agents",
        description: "Complete platform with project database, specialized consulting and training courses for councilors and political agents. Everything you need in one place.",
        cta1: "Start Free Trial",
        cta2: "View Demo"
      },
      video: {
        title: "See LegalGov in Action",
        description: "Discover how our platform can transform your political performance with our interactive tour.",
        demoTitle: "Interactive Demo",
        demoSubtitle: "Click to watch the platform tour",
        videoNotSupported: "Your browser does not support HTML5 videos."
      },
      features: {
        title: "Everything you need in one platform",
        description: "We offer a complete solution for political agents, with specialized resources to optimize your work and ensure legal compliance.",
        database: {
          title: "Project Database",
          description: "Access to thousands of bills organized by category, with customizable templates updated according to current legislation.",
          alt: "Organized digital project database"
        },
        consultation: {
          title: "Specialized Consulting",
          description: "Direct consultations with public and political law experts. Personalized guidance for your specific demands.",
          alt: "Specialized legal consulting"
        },
        education: {
          title: "Training",
          description: "Specialized courses and training to improve your skills and stay updated with best practices.",
          alt: "Training and courses platform"
        }
      },
      pricing: {
        title: "Plans designed for you",
        description: "Choose the ideal plan for your needs. All include specialized support.",
        plans: {
          basic: {
            name: "Basic",
            price: "$75",
            period: "/month",
            description: "Ideal for beginners",
            features: [
              "Full access to project database",
              "3 monthly consultations",
              "Email support"
            ],
            cta: "Get Started"
          },
          plus: {
            name: "Plus",
            price: "$150",
            period: "/month", 
            description: "For active professionals",
            popular: "Popular",
            features: [
              "Everything in Basic plan",
              "5 monthly consultations",
              "Priority support",
              "Customizable templates"
            ],
            cta: "Get Started"
          },
          complete: {
            name: "Complete",
            price: "Contact us",
            description: "Complete solution",
            features: [
              "Everything in Plus plan",
              "Unlimited consultations",
              "Access to courses",
              "24/7 priority support",
              "Personalized consulting"
            ],
            cta: "Contact Us"
          }
        }
      },
      stats: {
        title: "Impressive numbers",
        clients: {
          number: "500+",
          label: "Active Clients"
        },
        projects: {
          number: "10,000+",
          label: "Available Projects"
        },
        consultations: {
          number: "50,000+",
          label: "Consultations Delivered"
        },
        satisfaction: {
          number: "98%",
          label: "Client Satisfaction"
        }
      },
      footer: {
        company: "LegalGov",
        description: "Transforming political legal advisory with technology and specialized expertise.",
        rights: "All rights reserved.",
        links: {
          product: "Product",
          company: "Company",
          support: "Support"
        },
        productLinks: [
          "Project Database",
          "Consulting",
          "Training", 
          "Pricing"
        ],
        companyLinks: [
          "About Us",
          "Our Team",
          "Careers",
          "Contact"
        ],
        supportLinks: [
          "Help Center",
          "Documentation", 
          "Status",
          "Privacy Policy"
        ]
      }
    }
  };

  const contentData = content[language as keyof typeof content];

  const handleLogin = () => {
    navigate('/login');
  };

  const handleRegister = () => {
    navigate('/register');
  };

  const handleDashboard = () => {
    if (user?.role === 'admin') {
      navigate('/admin/dashboard');
    } else if (user?.role === 'lawyer') {
      navigate('/lawyer/dashboard');
    } else if (user?.role === 'customer') {
      navigate('/customer/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-background/95 backdrop-blur-sm border-b border-border z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="font-display font-bold text-2xl text-primary">
            Legal<span className="text-accent">Gov</span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-muted-foreground hover:text-primary transition-colors">{contentData.navFeatures}</a>
            <a href="#pricing" className="text-muted-foreground hover:text-primary transition-colors">{contentData.navPricing}</a>
            <a href="#about" className="text-muted-foreground hover:text-primary transition-colors">{contentData.navAbout}</a>
            <LanguageToggle />
            {isAuthenticated ? (
              <Button variant="outline" size="sm" onClick={handleDashboard}>
                {t('dashboard')}
              </Button>
            ) : (
              <>
                <Button variant="outline" size="sm" onClick={handleLogin}>
                  {contentData.login}
                </Button>
                <Button size="sm" className="bg-gradient-gold" onClick={handleRegister}>
                  {contentData.start}
                </Button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 lg:pt-32 lg:pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-overlay"></div>
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt="Assessoria jurídica para políticos" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center text-primary-foreground animate-fade-in">
            <Badge className="mb-6 bg-accent/20 text-accent border-accent/30 animate-scale-in">
              {contentData.hero.badge}
            </Badge>
            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight animate-slide-up">
              {contentData.hero.title}
              <span className="block text-accent animate-float">{contentData.hero.subtitle}</span>
            </h1>
            <p className="text-lg md:text-xl mb-8 text-primary-foreground/90 max-w-3xl mx-auto leading-relaxed animate-fade-in [animation-delay:0.3s]">
              {contentData.hero.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up [animation-delay:0.6s]">
              {isAuthenticated ? (
                <Button size="lg" onClick={handleDashboard} className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-gold text-lg px-8 py-3 transition-all duration-300 hover:scale-105 hover:shadow-luxury">
                  {t('dashboard')}
                </Button>
              ) : (
                <>
                  <Button size="lg" onClick={handleRegister} className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-gold text-lg px-8 py-3 transition-all duration-300 hover:scale-105 hover:shadow-luxury">
                    {contentData.hero.cta1}
                  </Button>
                  <Button size="lg" variant="outline" onClick={handleLogin} className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 text-lg px-8 py-3 transition-all duration-300 hover:scale-105">
                    {contentData.hero.cta2}
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Video Demo Section */}
      <section className="py-16 lg:py-24 bg-gradient-subtle">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-6 text-primary">
              {contentData.video.title}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {contentData.video.description}
            </p>
          </div>
          <div className="max-w-4xl mx-auto animate-scale-in [animation-delay:0.3s]">
            <div className="relative aspect-video rounded-2xl overflow-hidden shadow-luxury bg-gradient-card border border-border/50">
              <div className="absolute inset-0 bg-gradient-overlay flex items-center justify-center">
                <div className="text-center text-primary-foreground">
                  <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                    <svg className="w-8 h-8 text-accent-foreground" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{contentData.video.demoTitle}</h3>
                  <p className="text-primary-foreground/80">{contentData.video.demoSubtitle}</p>
                </div>
              </div>
              {/* Placeholder for actual video */}
              <video 
                className="w-full h-full object-cover opacity-20" 
                poster={heroImage}
                controls
              >
                <source src="/demo-video.mp4" type="video/mp4" />
                {contentData.video.videoNotSupported}
              </video>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-6 text-primary">
              {contentData.features.title}
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              {contentData.features.description}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="shadow-card hover:shadow-luxury transition-all duration-500 group overflow-hidden bg-gradient-card border border-border/50 animate-fade-in [animation-delay:0.1s] hover:scale-105">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={databaseImage} 
                  alt={contentData.features.database.alt} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-primary/30 group-hover:bg-gradient-primary/20 transition-all duration-500"></div>
              </div>
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-card group-hover:shadow-luxury">
                  <Database className="h-8 w-8 text-primary-foreground" />
                </div>
                <CardTitle className="text-xl font-semibold text-primary group-hover:text-accent transition-colors duration-300">{contentData.features.database.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-base leading-relaxed">
                  {contentData.features.database.description}
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="shadow-card hover:shadow-luxury transition-all duration-500 group overflow-hidden bg-gradient-card border border-border/50 animate-fade-in [animation-delay:0.3s] hover:scale-105">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={consultationImage} 
                  alt={contentData.features.consultation.alt} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-gold/30 group-hover:bg-gradient-gold/20 transition-all duration-500"></div>
              </div>
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-gold rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-card group-hover:shadow-gold">
                  <MessageCircle className="h-8 w-8 text-accent-foreground" />
                </div>
                <CardTitle className="text-xl font-semibold text-primary group-hover:text-accent transition-colors duration-300">{contentData.features.consultation.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-base leading-relaxed">
                  {contentData.features.consultation.description}
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="shadow-card hover:shadow-luxury transition-all duration-500 group overflow-hidden bg-gradient-card border border-border/50 animate-fade-in [animation-delay:0.5s] hover:scale-105">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={educationImage} 
                  alt={contentData.features.education.alt} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-primary/30 group-hover:bg-gradient-primary/20 transition-all duration-500"></div>
              </div>
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-card group-hover:shadow-luxury">
                  <BookOpen className="h-8 w-8 text-primary-foreground" />
                </div>
                <CardTitle className="text-xl font-semibold text-primary group-hover:text-accent transition-colors duration-300">{contentData.features.education.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-base leading-relaxed">
                  {contentData.features.education.description}
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 lg:py-24 bg-gradient-subtle">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-6 text-primary">
              {contentData.pricing.title}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {contentData.pricing.description}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Basic Plan */}
            <Card className="shadow-card hover:shadow-luxury transition-all duration-500 bg-gradient-card border border-border/50 animate-scale-in [animation-delay:0.1s] hover:scale-105 group">
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-2xl font-bold text-primary mb-2 group-hover:text-accent transition-colors duration-300">{contentData.pricing.plans.basic.name}</CardTitle>
                <div className="text-4xl font-bold text-primary mb-2 group-hover:text-accent transition-colors duration-300">
                  {contentData.pricing.plans.basic.price}<span className="text-lg font-normal text-muted-foreground">{contentData.pricing.plans.basic.period}</span>
                </div>
                <CardDescription>{contentData.pricing.plans.basic.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {contentData.pricing.plans.basic.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-accent flex-shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
                <Button className="w-full mt-6" variant="outline" onClick={handleRegister}>
                  {contentData.pricing.plans.basic.cta}
                </Button>
              </CardContent>
            </Card>

            {/* Plus Plan */}
            <Card className="shadow-luxury border-accent relative overflow-hidden bg-gradient-card animate-scale-in [animation-delay:0.3s] hover:scale-105 group transition-all duration-500">
              <div className="absolute top-0 right-0 bg-gradient-gold text-accent-foreground px-3 py-1 text-sm font-semibold animate-pulse">
                {contentData.pricing.plans.plus.popular}
              </div>
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-2xl font-bold text-primary mb-2 group-hover:text-accent transition-colors duration-300">{contentData.pricing.plans.plus.name}</CardTitle>
                <div className="text-4xl font-bold text-primary mb-2 group-hover:text-accent transition-colors duration-300">
                  {contentData.pricing.plans.plus.price}<span className="text-lg font-normal text-muted-foreground">{contentData.pricing.plans.plus.period}</span>
                </div>
                <CardDescription>{contentData.pricing.plans.plus.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {contentData.pricing.plans.plus.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-accent flex-shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
                <Button className="w-full mt-6 bg-gradient-gold" onClick={handleRegister}>
                  {contentData.pricing.plans.plus.cta}
                </Button>
              </CardContent>
            </Card>

            {/* Complete Plan */}
            <Card className="shadow-card hover:shadow-luxury transition-all duration-500 bg-gradient-card border border-border/50 animate-scale-in [animation-delay:0.5s] hover:scale-105 group">
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-2xl font-bold text-primary mb-2 group-hover:text-accent transition-colors duration-300">{contentData.pricing.plans.complete.name}</CardTitle>
                <div className="text-4xl font-bold text-primary mb-2 group-hover:text-accent transition-colors duration-300">
                  <span className="text-lg font-normal text-muted-foreground">{contentData.pricing.plans.complete.price}</span>
                </div>
                <CardDescription>{contentData.pricing.plans.complete.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {contentData.pricing.plans.complete.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-accent flex-shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
                <Button className="w-full mt-6" variant="outline" onClick={handleRegister}>
                  {contentData.pricing.plans.complete.cta}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-6 text-primary">
              {contentData.stats.title}
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center animate-scale-in [animation-delay:0.1s]">
              <div className="text-4xl font-bold text-primary mb-2">{contentData.stats.clients.number}</div>
              <p className="text-muted-foreground">{contentData.stats.clients.label}</p>
            </div>
            <div className="text-center animate-scale-in [animation-delay:0.2s]">
              <div className="text-4xl font-bold text-primary mb-2">{contentData.stats.projects.number}</div>
              <p className="text-muted-foreground">{contentData.stats.projects.label}</p>
            </div>
            <div className="text-center animate-scale-in [animation-delay:0.3s]">
              <div className="text-4xl font-bold text-primary mb-2">{contentData.stats.consultations.number}</div>
              <p className="text-muted-foreground">{contentData.stats.consultations.label}</p>
            </div>
            <div className="text-center animate-scale-in [animation-delay:0.4s]">
              <div className="text-4xl font-bold text-primary mb-2">{contentData.stats.satisfaction.number}</div>
              <p className="text-muted-foreground">{contentData.stats.satisfaction.label}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-gradient-hero">
        <div className="container mx-auto px-4 text-center animate-fade-in">
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-6 text-primary-foreground">
            {language === 'pt' ? 'Pronto para transformar sua atuação política?' : 'Ready to transform your political performance?'}
          </h2>
          <p className="text-lg text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            {language === 'pt' 
              ? 'Junte-se a centenas de agentes políticos que já confiam na LegalGov para orientação jurídica especializada.'
              : 'Join hundreds of political agents who already trust LegalGov for specialized legal guidance.'
            }
          </p>
          {isAuthenticated ? (
            <Button size="lg" onClick={handleDashboard} className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-gold text-lg px-8 py-3">
              {t('dashboard')}
            </Button>
          ) : (
            <Button size="lg" onClick={handleRegister} className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-gold text-lg px-8 py-3">
              {language === 'pt' ? 'Começar Teste Gratuito de 7 Dias' : 'Start 7-Day Free Trial'}
            </Button>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="font-display font-bold text-2xl text-primary mb-4">
                {contentData.footer.company}
              </div>
              <p className="text-muted-foreground">
                {contentData.footer.description}
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-primary mb-4">{contentData.footer.links.product}</h4>
              <ul className="space-y-2 text-muted-foreground">
                {contentData.footer.productLinks.map((link, index) => (
                  <li key={index}><a href="#" className="hover:text-primary transition-colors">{link}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-primary mb-4">{contentData.footer.links.company}</h4>
              <ul className="space-y-2 text-muted-foreground">
                {contentData.footer.companyLinks.map((link, index) => (
                  <li key={index}><a href="#" className="hover:text-primary transition-colors">{link}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-primary mb-4">{contentData.footer.links.support}</h4>
              <ul className="space-y-2 text-muted-foreground">
                {contentData.footer.supportLinks.map((link, index) => (
                  <li key={index}><a href="#" className="hover:text-primary transition-colors">{link}</a></li>
                ))}
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 {contentData.footer.company}. {contentData.footer.rights}</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;