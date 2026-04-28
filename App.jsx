import React, { useState } from 'react';
import './styles.css';
import MainMenu from './ui/MainMenu';
import EpisodeScreen from './ui/EpisodeScreen';
import StatsPage from './ui/StatsPage';

export default function App() {
  const [screen, setScreen] = useState('menu');
  const [gameData, setGameData] = useState(null);

  const startGame = (config) => {
    setGameData(config);
    setScreen('episode');
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <h1>Reality Show Simulator</h1>
        <nav>
          <button onClick={() => setScreen('menu')}>Menu</button>
          <button onClick={() => setScreen('stats')}>Stats</button>
          {gameData && <button onClick={() => setScreen('episode')}>Season</button>}
        </nav>
      </header>

      <main>
        {screen === 'menu' && <MainMenu onStart={startGame} />}
        {screen === 'stats' && <StatsPage />}
        {screen === 'episode' && gameData && <EpisodeScreen gameData={gameData} />}
      </main>
    </div>
  );
}
