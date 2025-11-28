import {useEffect, useState} from "react";
import {type Challenge, MCQChallenge} from "../challenge/MCQChallenge.tsx";
import {useApi} from "../utils/api.ts";

export function HistoryPanel() {
    const [history, setHistory] = useState<Challenge[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const {makeRequest} = useApi()
    useEffect(() => {
        fetchHistory()
    },[])
    
    const fetchHistory = async () => {
        setIsLoading(true)
        setError(null)
        
        try {
            const data  = await makeRequest("history")
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            setHistory(data)
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