import {useState} from "react";
import {type Challenge, MCQChallenge} from "./MCQChallenge.tsx";

export interface Quota {
    quota_remaining: number;
}
export function ChallengeGenerator() {
    const[challenge, setChallenge] = useState<Challenge | null>(null)
    const[isLoading, setIsLoading] = useState<boolean>(false)
    const[error, setError] = useState<string | null>(null)
    const[difficulty, setDifficulty] = useState<string>("easy")
    const[quota, setQuota] = useState<Quota | null>(null)
    
    const fetchQuota = async () => {}
    const generateChallenge = async () => {}
    const getNextResetTime = () => {}
    
    return <>
        <div className="challenge-container">
            <h2>Coding Challenge Generator</h2>
            
            <div className="quota-display">
                <p>Challenges remaining today: {quota?.quota_remaining || 0} </p>
                {
                    quota?.quota_remaining === 0 && (
                        <p>The next reset is: {0}</p>
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