import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Download, Check } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const DORA_PROMPTS = [
  {
    id: 'v1',
    name: 'Tech Office Classic',
    prompt: 'Professional Brazilian woman with olive/morena skin tone, wavy brown hair, beautiful green eyes, warm confident smile. Wearing elegant dark charcoal blazer over light blue casual shirt. Small delicate heart and butterfly tattoos on forearm. Modern wireless headset. Standing in modern tech startup office with blue LED accent lights and glass walls. Clean, professional, approachable. Photorealistic portrait, high quality, soft lighting.'
  },
  {
    id: 'v2',
    name: 'Futuristic Executive',
    prompt: 'Professional Brazilian woman with olive/morena skin tone, wavy brown hair, striking green eyes, friendly confident expression. Wearing navy blue modern blazer, holding transparent tablet with holographic display. Small minimalist tattoos visible on arm. Background: futuristic office with purple and blue neon lights, space-themed decorations, orbital elements. Tech-savvy executive vibe. Photorealistic, high quality.'
  },
  {
    id: 'v3',
    name: 'AI Tech Specialist',
    prompt: 'Professional Brazilian woman with olive/morena skin tone, wavy brown hair, bright green eyes, welcoming smile. Wearing modern fitted white shirt with rolled sleeves, silver wireless headset. Delicate butterfly tattoo on forearm. Background: abstract digital pattern with AI neural network visualization, circuit board elements, blue and teal color scheme. Innovative tech specialist look. Photorealistic portrait.'
  },
  {
    id: 'v4',
    name: 'Orbital/Space Theme',
    prompt: 'Professional Brazilian woman with olive/morena skin tone, wavy brown hair, vivid green eyes, confident approachable smile. Wearing casual tech look: dark fitted blazer over simple black t-shirt. Small heart tattoo visible. Background: modern office with large window showing starry space view, subtle orbital/planet elements, purple and blue ambient lighting. Space-age tech company vibe. Photorealistic, cinematic lighting.'
  }
];

interface GeneratedImage {
  id: string;
  url: string;
  loading: boolean;
  error?: string;
}

export default function AdminGenerateDora() {
  const [images, setImages] = useState<Record<string, GeneratedImage>>({});
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const generateImage = async (promptData: typeof DORA_PROMPTS[0]) => {
    setImages(prev => ({
      ...prev,
      [promptData.id]: { id: promptData.id, url: '', loading: true }
    }));

    try {
      const { data, error } = await supabase.functions.invoke('generate-dora-image', {
        body: { prompt: promptData.prompt }
      });

      if (error) throw error;

      if (data.error) {
        throw new Error(data.error);
      }

      setImages(prev => ({
        ...prev,
        [promptData.id]: { id: promptData.id, url: data.image, loading: false }
      }));

      toast.success(`Imagem "${promptData.name}" gerada com sucesso!`);
    } catch (error: any) {
      console.error('Error generating image:', error);
      setImages(prev => ({
        ...prev,
        [promptData.id]: { id: promptData.id, url: '', loading: false, error: error.message }
      }));
      toast.error(`Erro ao gerar "${promptData.name}": ${error.message}`);
    }
  };

  const generateAll = async () => {
    for (const prompt of DORA_PROMPTS) {
      await generateImage(prompt);
    }
  };

  const downloadImage = (url: string, name: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `dora-${name}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Download iniciado!');
  };

  const selectAsAvatar = (id: string) => {
    setSelectedImage(id);
    toast.success('Imagem selecionada como avatar da Dora!');
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Gerar Avatar da Dora</h1>
          <p className="text-muted-foreground">
            Gere 4 variações de imagem para a assistente virtual Dora usando IA
          </p>
        </div>

        <div className="mb-6">
          <Button onClick={generateAll} size="lg" className="gap-2">
            Gerar Todas as 4 Imagens
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {DORA_PROMPTS.map((promptData) => {
            const image = images[promptData.id];
            const isSelected = selectedImage === promptData.id;

            return (
              <Card key={promptData.id} className={`overflow-hidden ${isSelected ? 'ring-2 ring-primary' : ''}`}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center justify-between">
                    {promptData.name}
                    {isSelected && <Check className="h-5 w-5 text-primary" />}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-square bg-muted rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                    {image?.loading ? (
                      <div className="flex flex-col items-center gap-2">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <span className="text-sm text-muted-foreground">Gerando...</span>
                      </div>
                    ) : image?.url ? (
                      <img 
                        src={image.url} 
                        alt={promptData.name}
                        className="w-full h-full object-cover"
                      />
                    ) : image?.error ? (
                      <div className="text-center p-4">
                        <p className="text-destructive text-sm">{image.error}</p>
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-sm">Clique em gerar</p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => generateImage(promptData)}
                      disabled={image?.loading}
                      variant="outline"
                      className="flex-1"
                    >
                      {image?.loading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        'Gerar'
                      )}
                    </Button>

                    {image?.url && (
                      <>
                        <Button
                          onClick={() => downloadImage(image.url, promptData.id)}
                          variant="outline"
                          size="icon"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          onClick={() => selectAsAvatar(promptData.id)}
                          variant={isSelected ? 'default' : 'secondary'}
                        >
                          {isSelected ? 'Selecionado' : 'Usar'}
                        </Button>
                      </>
                    )}
                  </div>

                  <details className="mt-3">
                    <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">
                      Ver prompt
                    </summary>
                    <p className="text-xs text-muted-foreground mt-2 p-2 bg-muted rounded">
                      {promptData.prompt}
                    </p>
                  </details>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
