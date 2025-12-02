import {useEffect, useState} from "react";
import {MCQChallenge} from "./MCQChallenge.tsx";
import type {Quota} from "../models/Quota.ts";
import type {Challenge} from "../models/Challenge.ts";
import {useAuth} from "@clerk/clerk-react";


export function ChallengeGenerator() {
    const[challenge, setChallenge] = useState<Challenge>()
    const[isLoading, setIsLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const[difficulty, setDifficulty] = useState<string>("easy")
    const[quota, setQuota] = useState<Quota | null>(null)
    
    // const {makeRequest} = useApi()
    const {getToken} = useAuth()
    
    useEffect(() => {
        fetchQuota()
    }, [])
    
    const fetchQuota = async () => {
        try {
            const token = await getToken()
            const defaultOptions = {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            }
            const response = await fetch("http://localhost:8000/api/quota",
                {...defaultOptions}
            )
            
            console.log(response)
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => null)
                
                if (response.status === 429) {
                    throw new Error("The daily quota has been reached. Please try again tomorrow.")
                }
                
                throw new Error(errorData?.detail || "An unknown error occurred.")
            }
            
            
            const data: Quota = await response.json()
            console.log(data)

            setQuota(data)
        } catch (error) {
            console.error(error)
        }
    }
    
    const generateChallenge = async () => {
        setIsLoading(true)
        setError("")
        
        try {
            const token = await getToken()
            const defaultOptions = {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            }
            const options = {
                method: "POST",
                body: JSON.stringify({difficulty})
            }
            
            const response = await fetch("http://localhost:8000/api/generate-challenge",
                {...defaultOptions, ...options}
            )
            
            const data: Challenge = await response.json()
            setChallenge(data)
            fetchQuota()
        } catch (error) {
            setError("Failed to generate challenge.")
            console.error(error)
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