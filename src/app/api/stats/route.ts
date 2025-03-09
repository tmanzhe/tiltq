import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

interface PlayerMatchStats {
    matchId: string;
    gameMode: string;
    duration: number;
    champion: string;
    kills: number;
    deaths: number;
    assists: number;
    kda: string;
    damage: number;
    gold: number;
    result: "Victory" | "Defeat";
}

interface MatchData {
    matchId: string;
    gameMode: string;
    duration: number;
    participants: {
        puuid: string;
        summonerName: string;
        championName: string;
        kills: number;
        deaths: number;
        assists: number;
        totalDamageDealt: number;
        goldEarned: number;
        win: boolean;
    }[];
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { matchData, playerName, puuid } = body;

        // Debug logs
        console.log('Received request body:', JSON.stringify(body, null, 2));
        console.log('Player name:', playerName);
        console.log('Player PUUID:', puuid);
        console.log('Match data array length:', matchData?.length || 0);

        const API_KEY = process.env.GEMINI_API_KEY;
        if (!API_KEY) {
            return NextResponse.json({ error: "Gemini API key missing." }, { status: 500 });
        }

        // Validate input
        if (!matchData || !Array.isArray(matchData) || matchData.length === 0) {
            console.error('Invalid or empty match data received');
            return NextResponse.json({ error: "No match data provided" }, { status: 400 });
        }

        if (!playerName || !puuid) {
            console.error('No player name or PUUID provided');
            return NextResponse.json({ error: "Player name and PUUID are required" }, { status: 400 });
        }

        // Process match data to get player stats
        const playerStats: PlayerMatchStats[] = matchData.map((match: MatchData) => {
            console.log('Processing match:', match.matchId);
            console.log('Match participants PUUIDs:', match.participants.map(p => p.puuid));
            
            const playerParticipant = match.participants.find(p => p.puuid === puuid);
            
            if (!playerParticipant) {
                console.log(`Player ${playerName} (PUUID: ${puuid}) not found in match ${match.matchId}`);
                return null;
            }

            console.log('Found player data:', playerParticipant);

            return {
                matchId: match.matchId,
                gameMode: match.gameMode,
                duration: Math.floor(match.duration / 60), // Convert to minutes
                champion: playerParticipant.championName,
                kills: playerParticipant.kills,
                deaths: playerParticipant.deaths,
                assists: playerParticipant.assists,
                kda: ((playerParticipant.kills + playerParticipant.assists) / 
                    (playerParticipant.deaths || 1)).toFixed(2),
                damage: playerParticipant.totalDamageDealt,
                gold: playerParticipant.goldEarned,
                result: playerParticipant.win ? "Victory" : "Defeat"
            };
        }).filter((stats): stats is PlayerMatchStats => stats !== null);

        console.log('Processed player stats:', playerStats);

        // Check if we found any matches for the player
        if (playerStats.length === 0) {
            console.error(`No matches found for player ${playerName} (PUUID: ${puuid})`);
            return NextResponse.json({ 
                error: "No matches found for this player",
                playerName,
                puuid,
                matchesChecked: matchData.length
            }, { status: 404 });
        }

        // Calculate overall stats
        const totalGames = playerStats.length;
        const wins = playerStats.filter(game => game.result === "Victory").length;
        const totalKills = playerStats.reduce((sum, game) => sum + game.kills, 0);
        const totalDeaths = playerStats.reduce((sum, game) => sum + game.deaths, 0);
        const totalAssists = playerStats.reduce((sum, game) => sum + game.assists, 0);
        const averageKDA = ((totalKills + totalAssists) / (totalDeaths || 1)).toFixed(2);

        console.log('Calculated stats:', {
            totalGames,
            wins,
            totalKills,
            totalDeaths,
            totalAssists,
            averageKDA
        });

        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const prompt = `You are the most toxic League player ever. Roast  "${playerName}" based on these stats:

            Overall Stats:
            - Games Played: ${totalGames}
            - Win Rate: ${((wins/totalGames) * 100).toFixed(1)}%
            - Average KDA: ${averageKDA}
            - Total Kills: ${totalKills}
            - Total Deaths: ${totalDeaths}
            - Total Assists: ${totalAssists}

            Recent Matches:
            ${playerStats.map(game => `
            ${game.champion} - ${game.result}
            KDA: ${game.kills}/${game.deaths}/${game.assists} (${game.kda})
            Duration: ${game.duration} minutes
            Game Mode: ${game.gameMode}
            `).join('\n')}
            
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

        return NextResponse.json({ 
            analysis: text,
            stats: {
                totalGames,
                winRate: ((wins/totalGames) * 100).toFixed(1),
                averageKDA,
                totalKills,
                totalDeaths,
                totalAssists,
                recentMatches: playerStats
            }
        });

    } catch (error) {
        console.error("Error details:", error);
        return NextResponse.json({ 
            error: "Failed to get analysis",
            details: error instanceof Error ? error.message : "Unknown error"
        }, { status: 500 });
    }
}