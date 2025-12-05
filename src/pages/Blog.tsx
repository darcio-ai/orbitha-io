import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar,
  Clock,
  ArrowRight,
  BookOpen
} from "lucide-react";

const Blog = () => {
  // Posts de exemplo - em uma implementação real, viriam de uma API
  const featuredPosts = [
    {
      id: 1,
      title: "Como a IA está revolucionando o atendimento ao cliente",
      slug: "ia-revolucionando-atendimento-cliente",
      excerpt: "Descubra como empresas estão usando inteligência artificial para transformar a experiência do cliente e aumentar a satisfação.",
      category: "IA & Atendimento",
      readTime: "5 min",
      date: "15 Jan 2024",
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop",
      featured: true
    },
    {
      id: 2,
      title: "WhatsApp Business API: Guia completo para automação",
      slug: "whatsapp-business-api-guia-automacao",
      excerpt: "Tudo que você precisa saber para implementar automação no WhatsApp e melhorar o relacionamento com seus clientes.",
      category: "WhatsApp",
      readTime: "8 min",
      date: "12 Jan 2024",
      image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=400&fit=crop"
    },
    {
      id: 3,
      title: "5 processos que toda PME deveria automatizar",
      slug: "processos-pme-automatizar",
      excerpt: "Identifique os principais gargalos operacionais e como a automação pode liberar tempo para focar no que realmente importa.",
      category: "Automação",
      readTime: "6 min",
      date: "10 Jan 2024",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop"
    }
  ];

  const recentPosts = [
    {
      id: 4,
      title: "Zapier vs n8n: Qual ferramenta escolher para sua empresa?",
      slug: "zapier-vs-n8n-ferramenta-escolher",
      excerpt: "Comparativo completo entre as principais plataformas de automação no mercado.",
      category: "Ferramentas",
      readTime: "7 min",
      date: "8 Jan 2024",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop"
    },
    {
      id: 5,
      title: "ROI da automação: Como calcular o retorno do investimento",
      slug: "roi-automacao-calcular-retorno",
      excerpt: "Métricas essenciais para medir o sucesso das suas iniciativas de automação.",
      category: "Produtividade",
      readTime: "4 min",
      date: "5 Jan 2024",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop"
    },
    {
      id: 6,
      title: "Chatbots inteligentes: Além das respostas automáticas",
      slug: "chatbots-inteligentes-respostas-automaticas",
      excerpt: "Como criar assistentes virtuais que realmente agregam valor ao seu negócio.",
      category: "IA & Chatbots",
      readTime: "6 min",
      date: "3 Jan 2024",
      image: "https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=800&h=400&fit=crop"
    },
    {
      id: 7,
      title: "As Principais IAs do Momento: ChatGPT, Claude, Gemini e Mais",
      slug: "principais-ias-do-momento",
      excerpt: "Conheça as inteligências artificiais que estão revolucionando o mercado em 2024 e como cada uma pode ajudar seu negócio.",
      category: "Tendências",
      readTime: "5 min",
      date: "28 Nov 2024",
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop"
    }
  ];

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="py-24 bg-gradient-hero">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="max-w-4xl">
            <Badge variant="secondary" className="mb-6">
              <BookOpen className="h-4 w-4 mr-2" />
              Blog & Insights
            </Badge>
            <h1 className="text-6xl md:text-8xl font-bold mb-6 text-left">
              Insights sobre <span className="bg-gradient-primary bg-clip-text text-transparent">IA e Automação</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl text-left">
              Fique por dentro das últimas tendências, dicas práticas e cases de sucesso 
              em inteligência artificial e automação para empresas.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 lg:px-6 py-16">
        {/* Featured Post */}
        {featuredPosts[0] && (
          <Card className="mb-12 overflow-hidden bg-card border-border shadow-card">
            <Link to={`/blog/${featuredPosts[0].slug}`}>
              <div className="relative">
                <img 
                  src={featuredPosts[0].image} 
                  alt={featuredPosts[0].title}
                  className="w-full h-64 md:h-80 object-cover"
                />
                <div className="absolute top-4 left-4">
                  <Badge variant="secondary">
                    Destaque
                  </Badge>
                </div>
              </div>
            </Link>
            <CardHeader className="p-8">
              <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-4">
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>{featuredPosts[0].date}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{featuredPosts[0].readTime}</span>
                </div>
                <Badge variant="outline">{featuredPosts[0].category}</Badge>
              </div>
              <Link to={`/blog/${featuredPosts[0].slug}`}>
                <CardTitle className="text-2xl md:text-3xl mb-4 hover:text-primary transition-colors">
                  {featuredPosts[0].title}
                </CardTitle>
              </Link>
              <p className="text-lg text-muted-foreground mb-6">
                {featuredPosts[0].excerpt}
              </p>
              <Button variant="outline" asChild>
                <Link to={`/blog/${featuredPosts[0].slug}`}>
                  Ler artigo completo
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
          </Card>
        )}

        {/* Recent Posts Grid */}
        <div>
          <h2 className="text-2xl font-bold mb-8">Artigos Recentes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredPosts.slice(1).concat(recentPosts).map((post) => (
              <Link key={post.id} to={`/blog/${post.slug}`}>
                <Card className="bg-card border-border hover:shadow-glow transition-all duration-300 group cursor-pointer h-full">
                  {post.image && (
                    <div className="relative overflow-hidden">
                      <img 
                        src={post.image} 
                        alt={post.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <CardHeader className="p-6">
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{post.date}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                    <Badge variant="outline" className="w-fit mb-3">
                      {post.category}
                    </Badge>
                    <CardTitle className="text-xl mb-3 group-hover:text-primary transition-colors">
                      {post.title}
                    </CardTitle>
                    <p className="text-muted-foreground text-sm">
                      {post.excerpt}
                    </p>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <Card className="mt-16 bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg">Precisa de ajuda?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Fale com nossos especialistas e descubra como implementar essas soluções na sua empresa.
            </p>
            <Button className="w-full md:w-auto" asChild>
              <a
                href="https://wa.me/5513991497873?text=Oi! Vi o blog e quero implementar IA na minha empresa"
                target="_blank"
                rel="noopener noreferrer"
              >
                Falar com Especialista
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Blog;
