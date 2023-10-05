import { useState, useEffect } from 'react';
import PropTypes from 'prop-types'
import { fetchAllUsers } from './firebaseUtils'; // Adjust the import path

export default function Leaderboard({ username }) {
    const [leaderboardData, setLeaderboardData] = useState([]);

    // Fetch leaderboard data from Firebase and set it in state
    const fetchData = async () => {
        const data = await fetchAllUsers();
        setLeaderboardData(data);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const sortedLeaderboard = [...leaderboardData];

    sortedLeaderboard.sort((a, b) => b.bestScore - a.bestScore);

    return (
        <div className="leaderboardContainer">

            <h2>Leaderboard</h2>
            <p onClick={fetchData}>Refresh Leaderboard</p>
            <div className="leaderboardList">
                {sortedLeaderboard.map((user, index) => (
                    <div
                        key={index}
                        className={`leaderboardItem ${index === 0 ? 'first' : index === 1 ? 'second' : index === 2 ? 'third' : ''} ${user.username === username ? 'userRanking' : ''}`}
                    >
                        <span className="rank">{index + 1}. </span>
                        <span className="username">{user.username} </span>
                        <span className="score">{user.bestScore}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

Leaderboard.propTypes = {
    username: PropTypes.string
}