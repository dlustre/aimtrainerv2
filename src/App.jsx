import { checkUserExists, createNewAccount, getBestScore, updateBestScore } from './firebaseUtils.jsx'
import { useState, useEffect } from 'react';
import useColorChange from 'use-color-change';
import useCountdown from './useCountdown.jsx';
import Leaderboard from './Leaderboard.jsx';
import logo from './filipinoStar.png';
import './styles.css';

export default function App() {

  const startingSize = 65;
  const [fetchedScore, setFetchedScore] = useState(null);
  const [leaderboardVisible, setLeaderboardVisible] = useState(false);
  const [targetVisible, setTargetVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [bestSessionScore, setBestSessionScore] = useState(0);
  const [inProgress, setInProgress] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [btnColor, setBtnColor] = useState('#FF5733');
  const [userId, setUserId] = useState(null);
  const { centiseconds, start } = useCountdown(handleEnd);

  const startingPos = {
    top: '50%',
    left: '48.4%',
  }
  const [btnPos, setBtnPos] = useState({ ...startingPos });

  const colorStyle = useColorChange(clickCount, {
    higher: '#a09dd4',
    duration: 500,
  })

  const [userCredentials, setUserCredentials] = useState({
    password: '',
    username: '',
  });

  function handleStart() {
    if (inProgress) {
      setInProgress(false);
      toggleDisplay(targetVisible, setTargetVisible);
      start(0);
      setBtnPos({ ...startingPos })
    } else {
      toggleDisplay(targetVisible, setTargetVisible);
      setInProgress(true);
      setClickCount(0);
      start(60);
    }
  }

  function handleEnd() {
    if (inProgress) {
      setInProgress(false);
      setBtnPos({ ...startingPos })
      toggleDisplay(targetVisible, setTargetVisible);
      toggleDisplay(modalVisible, setModalVisible);

      if (clickCount > bestSessionScore) {
        setBestSessionScore(clickCount);
      }

      if (userId) {
        if (fetchedScore === null) {
          fetchBestScore();
        }
        if (clickCount > fetchedScore) {
          updateBestScore(userId, clickCount);
          setFetchedScore(clickCount);
        }
      }
    }
  }

  async function handleSubmit() {
    const password = userCredentials.password;
    const username = userCredentials.username;

    const userExists = await checkUserExists(username, password);

    if (userExists === false) {
      const accountCreated = await createNewAccount(username, password);
      if (accountCreated !== false) {
        setUserId(accountCreated);
        updateBestScore(accountCreated, bestSessionScore);
        setFetchedScore(bestSessionScore);
      }
    } else {
      setUserId(userExists);
      fetchBestScore(userExists);
      if (bestSessionScore > fetchedScore) {
        updateBestScore(userExists, bestSessionScore);
        setFetchedScore(bestSessionScore);
      }
    }
  }

  function handleTargetClick() {
    updateCounter();
    start(60);
    moveButton();
  }

  const fetchBestScore = async (id = '') => {
    if (id !== '') {
      const fetched = await getBestScore(id);
      setFetchedScore(fetched);
    } else {
      const fetched = await getBestScore(userId);
      setFetchedScore(fetched);
    }
  };

  function updateCounter() {
    setClickCount((prevCount) => prevCount + 1)
  }

  function moveButton() {
    if (btnPos.top === startingPos.top && btnPos.left === startingPos.left) {
      const min = 40 - (clickCount / 2);
      const max = 60 + (clickCount / 2);
      const newTop = (Math.random() * (max - min) + min) + '%'; // Limit top position based on distance
      const newLeft = (Math.random() * (max - min) + min) + '%'; // Limit left position based on distance

      setBtnPos({ top: newTop, left: newLeft });
    } else {
      setBtnPos({ ...startingPos });
    }
  }

  function getRandomValue(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  function toggleDisplay(state, setState) {
    setState(!state);
  }

  function hasWhiteSpace(s) {
    return s.indexOf(' ') >= 0;
  }

  function credentialsValid() {
    const username = userCredentials.username;
    const password = userCredentials.password;
    return !hasWhiteSpace(username) && !hasWhiteSpace(password) && username !== '' && password !== '';
  }

  useEffect(() => {
    const colorInterval = setInterval(() => {
      const minColorValue = 50; // Ensure the color is not too dark
      const maxColorValue = 200; // Ensure the color is not too light
      const randomColor = `rgb(${getRandomValue(minColorValue, maxColorValue)}, 
                               ${getRandomValue(minColorValue, maxColorValue)}, 
                               ${getRandomValue(minColorValue, maxColorValue)})`;
      setBtnColor(randomColor);
    }, 650);

    return () => clearInterval(colorInterval);
  }, []);

  return (
    <>
      <div
        className='title'
        style={{ top: inProgress ? '46.2%' : '35%' }}
      >
        Aim Trainer
        <br />
        <span className='counter' style={colorStyle}>
          {inProgress ? clickCount : ''}
        </span>
      </div>

      <div className="homeAnchor" title='More cool stuff!'>
        <a target="_blank" rel="noreferrer" href="https://dlustre.github.io">
          <div className="imageContainer">
            <img className="homeImg" src={logo} alt="Star" />
          </div>
          <div className="nameContainer">
            dlustre
          </div>
        </a>
      </div>

      <button
        className='leaderboardBtn'
        onClick={() => toggleDisplay(leaderboardVisible, setLeaderboardVisible)}
      >
        <img src="https://img.icons8.com/ios-glyphs/90/FAB005/trophy.png" alt="trophy" />
      </button>

      <div className='playableArea'>
        <button
          className='targetBtn'
          onClick={handleTargetClick}
          style={{
            top: btnPos.top,
            left: btnPos.left,
            backgroundColor: btnColor,
            width: (startingSize - (clickCount * .2)) + 'px',
            height: (startingSize - (clickCount * .2)) + 'px',
            display: targetVisible ? 'flex' : 'none',
          }}
        />
      </div>

      <button
        className='startBtn'
        onClick={handleStart}
        title='Start'
        style={{
          background: inProgress ? `rgb(${255 - (centiseconds * 4)}, 0, 0)` : 'linear-gradient(to right, rgb(124, 224, 66), rgb(51, 139, 147))',
          top: inProgress ? '92%' : '50%',
          width: inProgress ? `${centiseconds / 10}vw` : '10vw',
          left: inProgress ? '48%' : '45%',
          display: !inProgress || centiseconds >= 3 ? 'block' : 'none'
        }}
      >
        {inProgress ? centiseconds >= 10 ? centiseconds.toString().charAt(0) : '' : 'Start'}
      </button>

      <div
        className='bg'
        style={{
          display: modalVisible || leaderboardVisible ? 'block' : 'none',
        }}
      />
      <div
        className='modal'
        style={{
          display: modalVisible ? 'block' : 'none', // Toggle the display based on modal visibility
        }}
      >

        <div className='modalText'>
          {userId && userCredentials.username + '\'s Stats:'}
          {userId && <br />}
          {userId && <br />}
          {`Latest Score: ${clickCount}`}
          <br />
          <span className='modalSecondaryText'>
            {`Highest this Session: ${bestSessionScore}`}
          </span>
          <br />
          {userId ? `Personal Best: ${fetchedScore !== null ? fetchedScore : 'Fetching...'}` : 'Login to record your best score!'}
        </div>


        <div
          className='modalInputField'
          style={{
            display: userId === null ? 'block' : 'none',
          }}
        >
          <input
            type="text"
            name="username"
            id="username"
            className='modalInput'
            placeholder='Username'
            autoComplete='username'
            onChange={e => setUserCredentials({ ...userCredentials, username: e.target.value })}
          />

          <input
            type="password"
            name="password"
            id="password"
            className='modalInput'
            placeholder='Password'
            onChange={e => setUserCredentials({ ...userCredentials, password: e.target.value })}
          />
          <button
            disabled={!credentialsValid() ? 'disabled' : null}
            className={!credentialsValid() ? 'submitBtn' : 'submitBtn submitBtnHover'}
            type="submit"
            onClick={!credentialsValid() ? null : handleSubmit}
            style={{
              opacity: !credentialsValid() ? '0.7' : '1',
              cursor: !credentialsValid() ? '' : 'pointer',
            }}
          >
            Submit
          </button>
        </div>

        <button
          className='closeModalBtn'
          title='Close'
          onClick={() => toggleDisplay(modalVisible, setModalVisible)}
        >
          <img width="20" height="20f" src="https://img.icons8.com/ios-filled/50/FFFFFF/x.png" alt="x" />
        </button>
      </div>

      <div
        className='modal leaderboardModal'
        style={{
          display: leaderboardVisible ? 'block' : 'none', // Toggle the display based on modal visibility
        }}
      >
        <button
          className='closeModalBtn'
          title='Close'
          onClick={() => toggleDisplay(leaderboardVisible, setLeaderboardVisible)}
        >
          <img width="20" height="20f" src="https://img.icons8.com/ios-filled/50/FFFFFF/x.png" alt="x" />
        </button>

        <Leaderboard username={userId ? userCredentials.username : ''} />
      </div>
    </>
  )
}