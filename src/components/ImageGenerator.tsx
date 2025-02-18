
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

const API_URL = "https://api-inference.huggingface.co/models/DamarJati/FLUX.1-RealismLora";
const API_KEY = "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";

export const ImageGenerator = () => {
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const generateImage = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Please enter a prompt",
        description: "The prompt field cannot be empty.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({ inputs: prompt }),
      });

      if (!response.ok) throw new Error("Failed to generate image");

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setImageUrl(url);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8 flex flex-col items-center justify-center space-y-8">
      <Card className="w-full max-w-2xl p-6 glass-panel">
        <h1 className="text-3xl font-semibold text-center mb-6">AI Image Generation</h1>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Enter your image description..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="flex-1"
              disabled={isLoading}
            />
            <Button
              onClick={generateImage}
              disabled={isLoading}
              className="min-w-[120px]"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Generate"
              )}
            </Button>
          </div>

          {(isLoading || imageUrl) && (
            <div className="mt-8 rounded-xl overflow-hidden bg-secondary/50 aspect-square">
              {isLoading ? (
                <div className="w-full h-full shimmer flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary/40" />
                </div>
              ) : (
                <img
                  src={imageUrl}
                  alt="Generated"
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};
