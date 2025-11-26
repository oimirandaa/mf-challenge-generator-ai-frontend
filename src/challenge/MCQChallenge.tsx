import {useState} from "react";


export interface Challenge {
    id: number;
    difficulty: string;
    title: string;
    options: string[];
    correct_answer_id: number;
    explanation: string;
}


export function MCQChallenge({challenge, showExplanation=false}: { challenge: Challenge, showExplanation?: boolean}) {
    const [selectedOption, setSelectedOption] = useState<string>("")
    const [shouldShowExplanation, setShouldShowExplanation] = useState<boolean>(showExplanation)
    
    const options = typeof challenge.options === "string" ? JSON.parse(challenge.options) : challenge.options
    
    const handleOptionSelect = (index:string) => {
        if (selectedOption !== null) return;
        setSelectedOption(index)
        setShouldShowExplanation(true)
    }
    
    const getOptionClass = (index: string) => {
        if (selectedOption !== null) return "option"
        
        if (index === challenge.correct_answer_id.toString()) {
            return "option correct"
        }
        
        if (selectedOption === index && index !== challenge.correct_answer_id.toString()) {
            return "option incorrect"
        }
        
        return "option"
    }
    
    return <>
        <div className="challenge-display">
            <p><strong>Difficulty</strong>: {challenge.difficulty}</p>
            <p className = "challenge-title">{challenge.title}</p>
            <div className="options">
                {options.map((option:string, index:string) => (
                    <div
                        className={getOptionClass(index)}
                        key={index}
                        onClick={() => handleOptionSelect(index)}
                    >
                        {option}
                    </div>
                ))}
            </div>
            {shouldShowExplanation && selectedOption !== null && (
                <div className="explanation">
                    <h4>Explanation</h4>
                    <p>{challenge.explanation}</p>
                </div>
            )}
        </div>
    </>
}