import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DBUserData } from '@/api/types';
import { fetchLeaderboard } from '@/api/fetch';

const Leaderboard = () => {
  const [players, setPlayers] = useState<DBUserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadLeaderboard = async () => {
      try {
        setIsLoading(true);
        const data = await fetchLeaderboard();
        setPlayers(data);
      } catch (err) {
        setError('Failed to load leaderboard data');
        console.error('Error loading leaderboard:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadLeaderboard();
  }, []);

  return (
    <div className="min-h-screen py-8 px-4 bg-[#18181b]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <h1 className="text-4xl font-bold mb-8 text-center text-white norse">
          Hall of Warriors
        </h1>

        <div className="bg-[#27272a] rounded-lg shadow-xl overflow-hidden">
          {error ? (
            <div className="p-8 text-center text-red-400 norse text-xl">
              {error}
            </div>
          ) : isLoading ? (
            <div className="p-8 text-center text-gray-400 norse text-xl">
              Loading warriors...
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-[#3f3f46]">
                  <th className="px-6 py-4 text-left text-lg font-semibold text-white norse">Rank</th>
                  <th className="px-6 py-4 text-left text-lg font-semibold text-white norse">Warrior Name</th>
                  <th className="px-6 py-4 text-left text-lg font-semibold text-white norse">Level</th>
                  <th className="px-6 py-4 text-left text-lg font-semibold text-white norse">Score</th>
                </tr>
              </thead>
              <tbody>
                {players.map((player, index) => (
                  <tr 
                    key={player.id}
                    className="border-t border-[#3f3f46] hover:bg-[#3f3f46]/50 transition-colors"
                  >
                    <td className="px-6 py-4 text-white norse">#{index + 1}</td>
                    <td className="px-6 py-4 text-white norse">{player.name}</td>
                    <td className="px-6 py-4 text-white norse">{player.current_level}</td>
                    <td className="px-6 py-4 text-white norse">{player.score}</td>
                  </tr>
                ))}
                {players.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-gray-400 norse">
                      No warriors have proven their worth yet...
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Leaderboard;