import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types'
import { fetchAllUsers } from './firebaseUtils'; // Adjust the import path

export default function Leaderboard({ username }) {
    const [leaderboardData, setLeaderboardData] = useState([]);
    const userRankingRef = useRef(null);

    // Fetch leaderboard data from Firebase and set it in state
    async function fetchData() {
        const data = await fetchAllUsers();
        setLeaderboardData(data);
        scrollToUser();
    }

    function scrollToUser() {
        if (userRankingRef.current) {
            userRankingRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }

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
                        ref={user.username === username ? userRankingRef : null}
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