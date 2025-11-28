import {useEffect, useState} from "react";
import {type Challenge, MCQChallenge} from "./MCQChallenge.tsx";
import {useApi} from "../utils/api.ts";

export interface Quota {
    quota_remaining: number;
    last_reset_date: Date
}

export function ChallengeGenerator() {
    const[challenge, setChallenge] = useState<Challenge | null>(null)
    const[isLoading, setIsLoading] = useState<boolean>(false)
    const[error, setError] = useState<string | null>(null)
    const[difficulty, setDifficulty] = useState<string>("easy")
    const[quota, setQuota] = useState<Quota | null>(null)
    
    const {makeRequest} = useApi()
    
    useEffect(() => {
        fetchQuota()
    }, [])
    
    const fetchQuota = async () => {
        try {
            const data = await makeRequest("quota")
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            setQuota(data)
        } catch (error) {
            console.error(error)
        }
    }
    
    const generateChallenge = async () => {
        setIsLoading(true)
        setError(null)
        
        try {
            const data = await makeRequest("generate-challenge",
                {
                    method: "POST",
                    body: JSON.stringify({difficulty})
                })
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            setChallenge(data)
            fetchQuota()
        } catch (error: unknown) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            setError(error.message || "Failed to generate challenge")
        } finally {
            setIsLoading(false)
        }
    }
    
    const getNextResetTime = () => {
        if (!quota?.last_reset_date) return null
        
        const resetDate = new Date(quota.last_reset_date)
        resetDate.setHours(resetDate.getHours() + 24)
        return resetDate
    }
    
    return <>
        <div className="challenge-container">
            <h2>Coding Challenge Generator</h2>
            
            <div className="quota-display">
                <p>Challenges remaining today: {quota?.quota_remaining || 0} </p>
                {
                    quota?.quota_remaining === 0 && (
                        <p>The next reset is: {getNextResetTime()?.toLocaleString()}</p>
                    )
                }
            </div>
            
            <div className="difficulty-selector">
                <label htmlFor="difficulty">Select Difficulty</label>
                <select id="difficulty"
                        value={difficulty}
                        onChange={(e) => setDifficulty(e.target.value)}
                        disabled={isLoading}>
                    
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                </select>
            </div>
            
            <button
                onClick={generateChallenge}
                disabled={isLoading || quota?.quota_remaining === 0}
                className="generate-button"
            >{isLoading ? "Generating" : "Generate Challenge"}
            </button>
            
            {error && <div className="error-message">
                <p>{error}</p>
            </div>}
            
            {challenge && <MCQChallenge challenge={challenge}/>}
        </div>
        
        
    </>
}