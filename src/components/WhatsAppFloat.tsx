import { MessageCircle } from "lucide-react";

const WhatsAppFloat = () => {
  const handleWhatsAppClick = () => {
    window.open(
      "https://wa.me/5511999999999?text=Oi! Quero conhecer as soluções da Orbitha",
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <button
      onClick={handleWhatsAppClick}
      className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg transition-all duration-300 hover:scale-110 animate-pulse"
      aria-label="Falar no WhatsApp"
    >
      <MessageCircle className="h-6 w-6" />
    </button>
  );
};

export default WhatsAppFloat;