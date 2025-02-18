
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Plus, Loader2 } from "lucide-react";

const API_URL = "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0";
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
        body: JSON.stringify({ 
          inputs: prompt,
          options: {
            wait_for_model: true
          }
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        if (response.status === 429) {
          throw new Error("Rate limit reached. Please wait a minute before trying again.");
        }
        throw new Error(error.error || "Failed to generate image");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setImageUrl(url);
      
      toast({
        title: "Success!",
        description: "Image generated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8 flex flex-col space-y-8">
      <header className="flex items-center space-x-4">
        <div className="h-8 w-8 rounded-full bg-primary" />
        <h1 className="text-xl font-medium">AI Image Generation Tool</h1>
      </header>

      <div className="flex gap-8">
        <div className="flex-1 space-y-4">
          <div className="space-y-2">
            <h2 className="text-lg font-medium">Prompt</h2>
            <p className="text-sm text-muted-foreground">
              What would you like to generate? Provide a detailed description.
            </p>
          </div>

          <Card className="glass-panel">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the image you want to generate in detail..."
              className="w-full textarea-dark p-4"
              disabled={isLoading}
            />
          </Card>

          <div className="flex items-center gap-4">
            <Button
              onClick={generateImage}
              disabled={isLoading}
              className="bg-primary hover:bg-primary/90"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Plus className="h-4 w-4 mr-2" />
              )}
              Generate Image
            </Button>
          </div>
        </div>

        <Card className="flex-1 aspect-square glass-panel overflow-hidden flex items-center justify-center">
          {isLoading ? (
            <div className="w-full h-full shimmer flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary/40" />
            </div>
          ) : imageUrl ? (
            <img
              src={imageUrl}
              alt="Generated"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-center p-8">
              <p className="text-lg font-medium text-muted-foreground">
                Describe the image you want to generate and click "Generate Image"
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
