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

  const userPrompt = `Create a day itinerary for a Singaporean traveler in "${location || "Bangkok, Thailand"}".
Budget: approximately ${budget || "SGD 60"}.
Preferences: ${preferences || "food, drinks, dessert, shopping"}.

Based on the destination/location "${location || "Bangkok, Thailand"}", identify:
1. The local currency symbol (e.g. "¥" for Japan, "฿" for Thailand, "RM" for Malaysia, "Rp" for Indonesia, "元" or "¥" for China, "$" for others).
2. The local currency code (e.g. "JPY" for Japan, "THB" for Thailand, "MYR" for Malaysia, "IDR" for Indonesia, "CNY" for China, "SGD" for Singapore/others).
3. The current realistic exchange rate to SGD (e.g. 1 SGD = 110 JPY, 1 SGD = 28 THB, 1 SGD = 3.5 MYR, 1 SGD = 12000 IDR, 1 SGD = 5.4 CNY).

Return a JSON object with this exact structure:
{
  "title": "short catchy name for this day plan",
  "subtitle": "one-line description",
  "totalBudgetNote": "e.g. ~¥4,500 ≈ SGD 41",
  "currencySymbol": "local currency symbol",
  "currencyCode": "local currency code",
  "rateToSGD": exchange_rate_number,
  "merchants": [
    {
      "id": 1,
      "icon": "single emoji",
      "name": "merchant name",
      "category": "short category label",
      "rating": 4.8,
      "priceLocal": price_in_local_currency_number,
      "netsQr": true
    }
  ]
}

Include 5-7 merchants. Make sure the merchant names are highly realistic for the given location, and the prices are in the local currency and match the requested budget (converted using the exchange rate). All ratings must be between 4.0-5.0.`;

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
