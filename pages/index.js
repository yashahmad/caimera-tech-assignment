import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
    const [username, setUsername] = useState('');
    const router = useRouter();

    const handleStart = () => {
        if (username.trim()) router.push(`/quiz?username=${username}`);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-300">
            <div className="rounded-lg p-12 bg-gray-100 flex flex-col items-center">
                <h1 className="text-4xl font-bold mb-6">Math Quiz</h1>
                <input
                    type="text"
                    placeholder="Enter your username"
                    className="p-2 border rounded-lg mb-8 text-sm"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <button
                    className="bg-blue-400 hover:bg-blue-500 text-white font-bold px-4 py-2 rounded-lg"
                    onClick={handleStart}
                >
                    Start Quiz
                </button>
            </div>
        </div>
    );
}
