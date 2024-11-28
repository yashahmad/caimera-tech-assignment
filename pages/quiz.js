import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function Quiz() {
    const router = useRouter();
    const username = router.query.username || 'Guest';

    const [gameState, setGameState] = useState({ currentQuestion: null, scores: {} });
    const [answer, setAnswer] = useState('');

    useEffect(() => {
        const eventSource = new EventSource('/api/sse');
        eventSource.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setGameState(data);
        };
        return () => eventSource.close();
    }, []);

    const submitAnswer = async () => {
        if (!answer.trim()) {
            alert('Please enter an answer.');
            return;
        }

        try {
            const res = await fetch('/api/answer', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, answer }),
            });

            const data = await res.json();
            if (res.ok) {
                alert(data.message);
            } else {
                alert(`Error: ${data.error}`);
            }
        } catch (error) {
            console.error('Failed to submit answer:', error);
            alert('Failed to submit answer. Please try again.');
        }

        setAnswer('');
    };

    return (
        <>
            <div className="bg-gray-100 flex items-center justify-center min-h-screen">
                <div className="bg-white shadow-lg rounded-lg p-6 max-w-4xl w-full">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Question gameState={gameState} answer={answer} setAnswer={setAnswer} submitAnswer={submitAnswer} />
                        <Leaderboard gameState={gameState} />
                    </div>
                </div>
            </div>
        </>
    )
}

const Question = ({ gameState, answer, setAnswer, submitAnswer }) => {
    return (
        <>
            <div className="bg-blue-100 p-6 rounded-lg">
                <h2 className="text-2xl font-bold mb-4">Welcome!</h2>
                <p className="mb-4">Here is your question:</p>
                <p classNameName="font-semibold mb-4">
                    {gameState.currentQuestion?.question || 'Waiting for a new question...'}
                </p>
                <input type="text" placeholder="Your answer" value={answer} onChange={(e) => setAnswer(e.target.value)} className="w-full p-2 my-4 border rounded" />
                <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" onClick={submitAnswer}>Submit</button>
            </div>
        </>
    )
}

const Leaderboard = ({ gameState }) => {
    return (
        <>
            <div className="bg-green-100 p-6 rounded-lg">
                <h2 className="text-2xl font-bold mb-4">Leaderboard</h2>
                <ul className="space-y-2">
                    {Object.entries(gameState.scores).map(([user, score]) => (
                        <li key={user} classNameName="flex justify-between">
                            <span>{user} :</span>
                            <span>{score}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    )
}