import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { matchData, playerName } = body;

        const API_KEY = process.env.GEMINI_API_KEY;
        if (!API_KEY) {
            return NextResponse.json({ error: "Gemini API key missing." }, { status: 500 });
        }

        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const prompt = `You are the most toxic League player ever. Roast "${playerName}" based on these matches:
            ${JSON.stringify(matchData, null, 2)}
            
            Rules:
            - Keep it under 200 words
            - Use the most toxic League slang possible (kys, dogshit, braindead, turboint, pisslow, dogwater, can look for more terms online etc.)
            - All lowercase
            - Be extremely aggressive and personal
            - Mock their champion choices (especially if they play "easy" champs)
            - Call out their feeding and bad KDAs
            - Tell them to uninstall in the most toxic way
            - Reference specific terrible games as examples
            - Calculate and mock their average KDA
            - Use "💀" emoji for extra toxicity
            - The more brutal you are, the better
            - Call out their family members as well. 
            
            Make it one short, brutal paragraph that would get someone permabanned from League.`;

        const result = await model.generateContent(prompt);
        const text = result.response.text();

        return NextResponse.json({ analysis: text });

    } catch (error) {
        console.error("Error details:", error);
        return NextResponse.json({ error: "Failed to get analysis" }, { status: 500 });
    }
}