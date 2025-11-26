import {useEffect, useState} from "react";
import {type Challenge, MCQChallenge} from "../challenge/MCQChallenge.tsx";

export function HistoryPanel() {
    const [history, setHistory] = useState<Challenge[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    
    useEffect(() => {
        fetchHistory()
    },[])
    
    const fetchHistory = async () => {
        setIsLoading(true)
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