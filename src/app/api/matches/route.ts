import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    // Extract match IDs from the query parameters
    const searchParams = request.nextUrl.searchParams;
    const matchIds = searchParams.getAll("matchIds");

    console.log("Received match IDs:", matchIds); // Debug log

    // Validate that match IDs are provided
    if (matchIds.length === 0) {
        console.log("No match IDs provided"); // Debug log
        return NextResponse.json(
            { error: "Match IDs are required to fetch match statistics." },
            { status: 400 }
        );
    }

    // Get the API Key from environment variable
    const API_KEY = process.env.RIOT_API_KEY;
    if (!API_KEY) {
        console.log("API key missing"); // Debug log
        return NextResponse.json({ error: "API key missing." }, { status: 500 });
    }

    try {
        // Initialize an empty array to store match data
        let matchStatistics: any[] = [];

        // Loop through each match ID to fetch match details
        for (let matchId of matchIds) {
            console.log(`Fetching data for match ID: ${matchId}`); // Debug log
            
            // 🏆 Fetch match details using the match ID
            const matchUrl = `https://americas.api.riotgames.com/lol/match/v5/matches/${matchId}`;
            console.log("Requesting from URL:", matchUrl); // Debug log

            const matchResponse = await fetch(matchUrl + `?api_key=${API_KEY}`);
            console.log(`Response status for match ${matchId}:`, matchResponse.status); // Debug log

            if (!matchResponse.ok) {
                const errorText = await matchResponse.text();
                console.log(`Error response for match ${matchId}:`, errorText); // Debug log
                throw new Error(`Riot API error for match ${matchId}: ${matchResponse.status}`);
            }

            // Parse the match data
            const matchData = await matchResponse.json();
            console.log(`Received data for match ${matchId}:`, matchData.info ? 'Data OK' : 'No info object'); // Debug log
            
            if (!matchData.info) {
                console.log(`No info object in match data for ${matchId}:`, matchData); // Debug log
                continue;
            }

            // Extract relevant match statistics
            const matchStats = {
                matchId: matchId,
                gameMode: matchData.info.gameMode,
                duration: matchData.info.gameDuration,
                participants: matchData.info.participants.map((p: any) => ({
                    summonerName: p.summonerName,
                    championName: p.championName,
                    kills: p.kills,
                    deaths: p.deaths,
                    assists: p.assists,
                    totalDamageDealt: p.totalDamageDealtToChampions,
                    goldEarned: p.goldEarned,
                    win: p.win,
                }))
            };

            // Log the participants for this match
            console.log(`Participants in match ${matchId}:`, matchStats.participants.map((p: any) => ({
                summonerName: p.summonerName,
                championName: p.championName
            })));

            // Push the match statistics into the array
            matchStatistics.push(matchStats);
            console.log(`Successfully processed match ${matchId}`); // Debug log
        }

        console.log("Total matches processed:", matchStatistics.length); // Debug log
        
        if (matchStatistics.length === 0) {
            console.log("No match statistics were collected"); // Debug log
            return NextResponse.json(
                { error: "Failed to collect any match statistics." },
                { status: 500 }
            );
        }

        // 🔥 Return all match statistics
        return NextResponse.json({ matchStatistics });

    } catch (error) {
        console.error("Error in matches endpoint:", error); // Debug log
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "An unexpected error occurred" },
            { status: 500 }
        );
    }
}