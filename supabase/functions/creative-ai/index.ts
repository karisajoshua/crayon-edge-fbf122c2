import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, context } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    let systemPrompt = "";
    let userPrompt = "";

    switch (type) {
      case "story":
        systemPrompt = "You are a friendly storytelling assistant for children ages 6-11. Generate short, creative, age-appropriate story suggestions. Keep responses to 1-2 sentences.";
        userPrompt = `Help continue this story. Title: "${context.title}". Scene: ${context.scene}. Characters: ${context.characters?.join(", ") || "none"}. Objects: ${context.objects?.join(", ") || "none"}. Previous text: "${context.previousText || ""}". Generate a fun, short continuation (1-2 sentences).`;
        break;
      case "journal":
        systemPrompt = "You are a supportive journaling assistant for teens (12-18). Generate thoughtful, open-ended journal prompts that encourage self-reflection without being intrusive.";
        userPrompt = context.mood 
          ? `Generate a journal prompt for a teen feeling ${context.mood}. Keep it supportive and non-judgmental.`
          : "Generate a creative, thoughtful journal prompt for a teenager.";
        break;
      case "idea":
        systemPrompt = "You are a creative idea generator for teens (12-18). Generate inspiring creative prompts for writing, art, or design projects.";
        userPrompt = `Generate a ${context.category || "creative"} prompt for a teenager. Make it inspiring and open-ended.`;
        break;
      default:
        throw new Error("Invalid prompt type");
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const suggestion = data.choices?.[0]?.message?.content || "";

    return new Response(JSON.stringify({ suggestion }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("creative-ai error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
