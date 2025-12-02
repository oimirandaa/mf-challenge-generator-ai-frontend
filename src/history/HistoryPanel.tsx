import {useEffect, useState} from "react";
import type {Challenge} from "../models/Challenge.ts";
import {useAuth} from "@clerk/clerk-react";
import {MCQChallenge} from "../challenge/MCQChallenge.tsx";

export function HistoryPanel() {
    const [history, setHistory] = useState<Challenge[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    // const {makeRequest} = useHistoryApi()
    const {getToken} = useAuth()
    
    useEffect(() => {
        fetchHistory()
    },[])
    
    const fetchHistory = async () => {
        setIsLoading(true)
        setError(null)
        
        try {
            const token = await getToken()
            const defaultOptions = {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            }
            const endpoint = "/history"
            const response = await fetch(`http://localhost:8000/api${endpoint}`,
                {...defaultOptions}
            )
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json()
            console.log(data.challenges)
            setHistory(data.challenges)
        } catch (error) {
            setError("Failed to fetch history.")
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }
    
    if (isLoading) return <div>Loading History</div>
    
    if (error) {
        return <div className="error-message">
            <p>{error}</p>
            <button onClick={() => fetchHistory()}>Retry</button>
        </div>
    }
    
    return <>
        <div className="history-panel">
            <h2>History</h2>
            {
                history.length === 0 ? <p>No history available</p> :
                    <div className="history-list">
                        {
                            history.map((challenge: Challenge) => {
                                return <MCQChallenge
                                        challenge={challenge}
                                        key={challenge.id}
                                        showExplanation
                                                    />
                            })
                        }
                    </div>
            }
        </div>
    </>
}