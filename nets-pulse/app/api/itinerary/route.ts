import { NextRequest, NextResponse } from "next/server";

const DEEPSEEK_API_URL = "https://api.deepseek.com/chat/completions";

export async function POST(req: NextRequest) {
  const apiKey = process.env.DEEPSEEK_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "DEEPSEEK_API_KEY is not configured in .env.local" },
      { status: 500 }
    );
  }

  const { location, budget, preferences } = await req.json();

  const systemPrompt = `You are a smart travel-spending assistant for NETS, Singapore's payment network.
Your job is to generate a personalized day itinerary for a Singaporean traveler abroad.
ALL merchants must accept NETS QR payment.
You MUST respond with ONLY valid JSON — no markdown, no explanation, just the JSON object.`;

  const userPrompt = `Create a day itinerary for a Singaporean traveler in ${location || "Bangkok, Thailand"}.
Budget: approximately ${budget || "SGD 60"}.
Preferences: ${preferences || "food, drinks, dessert, shopping"}.

Return a JSON object with this exact structure:
{
  "title": "short catchy name for this day plan",
  "subtitle": "one-line description",
  "totalBudgetNote": "e.g. ~฿1,100 ≈ SGD 41",
  "merchants": [
    {
      "id": 1,
      "icon": "single emoji",
      "name": "merchant name",
      "category": "short category label",
      "rating": 4.8,
      "priceBaht": 90,
      "netsQr": true
    }
  ]
}
Include 5-7 merchants. Prices in Thai Baht (1 SGD ≈ 27-28 THB). Ratings between 4.0-5.0. Use realistic Bangkok merchant names.`;

  try {
    const response = await fetch(DEEPSEEK_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user",   content: userPrompt },
        ],
        temperature: 0.8,
        max_tokens: 1000,
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("DeepSeek error:", err);
      return NextResponse.json(
        { error: `DeepSeek API error: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content ?? "{}";

    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch {
      return NextResponse.json({ error: "Failed to parse AI response as JSON" }, { status: 500 });
    }

    return NextResponse.json(parsed);
  } catch (err) {
    console.error("Fetch error:", err);
    return NextResponse.json({ error: "Network error reaching DeepSeek" }, { status: 500 });
  }
}
