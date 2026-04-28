import React, { useState } from 'react';

export default function EpisodeScreen({ gameData }) {
  const [episode, setEpisode] = useState(1);
  const [players, setPlayers] = useState(
    gameData.selected.map(name => ({ name, status: 'IN' }))
  );
  const [log, setLog] = useState(['Season begins!']);

  const active = players.filter(p => p.status === 'IN');
  const merged = active.length <= 8;

  const simulateEpisode = () => {
    if (active.length <= 2) return;

    const challengeWinner = active[Math.floor(Math.random() * active.length)].name;
    const vulnerable = active.filter(p => p.name !== challengeWinner);
    const boot = vulnerable[Math.floor(Math.random() * vulnerable.length)].name;

    const updated = players.map(p =>
      p.name === boot ? { ...p, status: `OUT ${episode}` } : p
    );

    setPlayers(updated);
    setLog([
      `Episode ${episode}`,
      merged ? 'Merge Phase' : 'Team Phase',
      `${challengeWinner} wins immunity!`,
      `${boot} is eliminated.`
    ]);
    setEpisode(episode + 1);
  };

  return (
    <div className="episode-screen">
      <h2>Episode {episode}</h2>
      <p>{merged ? 'Merge Phase' : 'Team Phase'}</p>

      <div className="remaining-cast">
        <h3>Remaining Players</h3>
        {active.map(p => <span key={p.name}>{p.name} </span>)}
      </div>

      <div className="episode-log">
        {log.map((line, i) => <p key={i}>{line}</p>)}
      </div>

      <button onClick={simulateEpisode}>Simulate Next Episode</button>

      <div className="placements">
        <h3>Placements</h3>
        {players.map(p => (
          <p key={p.name}>{p.name} - {p.status}</p>
        ))}
      </div>
    </div>
  );
}
