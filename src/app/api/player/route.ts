import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const fullRiotId = searchParams.get("fullRiotId");

    console.log("Received request with fullRiotId:", fullRiotId); // Debug log

    // Validate input
    if (!fullRiotId) {
        console.log("No fullRiotId provided"); // Debug log
        return NextResponse.json(
            { error: "Riot ID is required." },
            { status: 400 }
        );
    }

    // Split the Riot ID into name and tag
    const [riotId, tag] = fullRiotId.split('#');
    
    console.log("Parsed Riot ID:", riotId, "Tag:", tag); // Debug log

    if (!riotId || !tag) {
        console.log("Invalid Riot ID format"); // Debug log
        return NextResponse.json(
            { error: "Invalid Riot ID format. Expected format: name#tag" },
            { status: 400 }
        );
    }

    // Get API Key from environment variable
    const API_KEY = process.env.RIOT_API_KEY;
    if (!API_KEY) {
        console.log("API key missing"); // Debug log
        return NextResponse.json({ error: "API key missing." }, { status: 500 });
    }

    try {
        // First, get PUUID from Riot ID
        const accountUrl = `https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(riotId)}/${encodeURIComponent(tag)}`;
        console.log("Fetching from Riot API:", accountUrl); // Debug log

        const accountResponse = await fetch(accountUrl + `?api_key=${API_KEY}`);
        console.log("Riot API response status:", accountResponse.status); // Debug log

        if (!accountResponse.ok) {
            const errorText = await accountResponse.text();
            console.log("Riot API error response:", errorText); // Debug log
            throw new Error(`Riot API error: ${accountResponse.status}`);
        }

        const accountData = await accountResponse.json();
        console.log("Account data received:", accountData); // Debug log

        // Return the PUUID and other account info
        return NextResponse.json({
            puuid: accountData.puuid,
            gameName: accountData.gameName,
            tagLine: accountData.tagLine
        });

    } catch (error) {
        console.error("Error in player endpoint:", error); // Debug log
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "An unexpected error occurred" },
            { status: 500 }
        );
    }
}