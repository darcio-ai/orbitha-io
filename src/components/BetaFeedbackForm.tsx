import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Star, Send, Sparkles } from "lucide-react";

interface BetaFeedbackFormProps {
  userId: string;
  assistantName?: string;
  onSuccess?: () => void;
}

const BetaFeedbackForm = ({ userId, assistantName, onSuccess }: BetaFeedbackFormProps) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState("");
  const [allowsTestimonial, setAllowsTestimonial] = useState(false);
  const [allowsScreenshot, setAllowsScreenshot] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (rating === 0) {
      toast({
        title: "Avaliação necessária",
        description: "Por favor, selecione uma nota de 1 a 5 estrelas.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.from("beta_feedback").insert({
        user_id: userId,
        rating,
        feedback_text: feedbackText.trim() || null,
        allows_testimonial: allowsTestimonial,
        allows_screenshot: allowsScreenshot,
        assistant_name: assistantName || null,
      });

      if (error) throw error;

      toast({
        title: "Feedback enviado!",
        description: "Muito obrigado pela sua avaliação. Isso nos ajuda muito!",
      });

      // Reset form
      setRating(0);
      setFeedbackText("");
      setAllowsTestimonial(false);
      setAllowsScreenshot(false);
      
      onSuccess?.();
    } catch (error: any) {
      console.error("Error submitting feedback:", error);
      toast({
        title: "Erro ao enviar",
        description: error.message || "Não foi possível enviar seu feedback.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Seu feedback é muito importante!
        </CardTitle>
        <CardDescription>
          Como beta tester, sua opinião nos ajuda a melhorar. Leva menos de 1 minuto!
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Star Rating */}
        <div className="space-y-2">
          <Label>Como você avalia sua experiência?</Label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="p-1 transition-transform hover:scale-110 focus:outline-none"
              >
                <Star
                  className={`h-8 w-8 transition-colors ${
                    star <= (hoverRating || rating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-muted-foreground/30"
                  }`}
                />
              </button>
            ))}
          </div>
          <p className="text-sm text-muted-foreground">
            {rating === 0 && "Clique para avaliar"}
            {rating === 1 && "Muito ruim 😞"}
            {rating === 2 && "Ruim 😕"}
            {rating === 3 && "Regular 😐"}
            {rating === 4 && "Bom 🙂"}
            {rating === 5 && "Excelente! 🤩"}
          </p>
        </div>

        {/* Feedback Text */}
        <div className="space-y-2">
          <Label htmlFor="feedback">O que funciona bem? O que pode melhorar?</Label>
          <Textarea
            id="feedback"
            placeholder="Conte sua experiência... (opcional)"
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
            rows={4}
            className="resize-none"
          />
        </div>

        {/* Permissions */}
        <div className="space-y-3">
          <Label>Autorizações (opcional)</Label>
          
          <div className="flex items-start space-x-3">
            <Checkbox
              id="testimonial"
              checked={allowsTestimonial}
              onCheckedChange={(checked) => setAllowsTestimonial(checked as boolean)}
            />
            <div className="grid gap-1">
              <Label htmlFor="testimonial" className="font-normal cursor-pointer">
                Autorizo usar meu feedback como depoimento
              </Label>
              <p className="text-xs text-muted-foreground">
                Seu nome pode aparecer no site como case de sucesso
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Checkbox
              id="screenshot"
              checked={allowsScreenshot}
              onCheckedChange={(checked) => setAllowsScreenshot(checked as boolean)}
            />
            <div className="grid gap-1">
              <Label htmlFor="screenshot" className="font-normal cursor-pointer">
                Autorizo usar prints das minhas conversas
              </Label>
              <p className="text-xs text-muted-foreground">
                Conversas podem ser usadas como exemplo (dados sensíveis serão ocultados)
              </p>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <Button 
          onClick={handleSubmit} 
          disabled={loading || rating === 0}
          className="w-full"
        >
          {loading ? (
            <>Enviando...</>
          ) : (
            <>
              <Send className="h-4 w-4 mr-2" />
              Enviar Feedback
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default BetaFeedbackForm;