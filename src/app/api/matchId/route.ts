import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const puuid = searchParams.get("puuid");

    console.log("Received PUUID in matchId endpoint:", puuid); // Debug log

    // Validate input (Ensure PUUID is provided)
    if (!puuid) {
        console.log("No PUUID provided"); // Debug log
        return NextResponse.json(
            { error: "PUUID is required to fetch match history." },
            { status: 400 }
        );
    }

    // Optional: Get 'count' parameter for limiting the number of match IDs (defaults to 10)
    const count = searchParams.get("count") || 10;
    const start = searchParams.get("start") || 0;

    // API Key from environment variable
    const API_KEY = process.env.RIOT_API_KEY;
    if (!API_KEY) {
        console.log("API key missing"); // Debug log
        return NextResponse.json({ error: "API key missing." }, { status: 500 });
    }

    try {
        // 🎮 Fetch Match History using PUUID (fetching match IDs for the player)
        const matchUrl = `https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=${start}&count=${count}`;
        console.log("Attempting to fetch from URL:", matchUrl); // Debug log

        const matchResponse = await fetch(matchUrl + `&api_key=${API_KEY}`);
        console.log("Match API Response Status:", matchResponse.status); // Debug log

        if (!matchResponse.ok) {
            const errorText = await matchResponse.text();
            console.log("Match API Error Response:", errorText); // Debug log
            throw new Error(`Riot API error: ${matchResponse.status}`);
        }

        // Parse the match data response
        const matchData = await matchResponse.json();
        console.log("Match IDs received:", matchData); // Debug log

        // Return the match IDs
        return NextResponse.json({ matchIds: matchData });

    } catch (error) {
        console.error("Error in matchId endpoint:", error); // Debug log
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "An unexpected error occurred" },
            { status: 500 }
        );
    }
}