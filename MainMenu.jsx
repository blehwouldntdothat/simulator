import React, { useState } from 'react';

const premadeCast = [
  'Aiden','Luna','Marcus','Jade','Theo','Scarlett','Nick','Riya','Ellis','Brooke'
];

export default function MainMenu({ onStart }) {
  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState('');
  const [advantages, setAdvantages] = useState(true);
  const [specialChallenges, setSpecialChallenges] = useState(true);
  const [finaleFormat, setFinaleFormat] = useState('Top 2');

  const filtered = premadeCast.filter(c =>
    c.toLowerCase().includes(search.toLowerCase())
  );

  const addContestant = (name) => {
    if (!selected.includes(name)) setSelected([...selected, name]);
  };

  const addRandom = () => {
    const remaining = premadeCast.filter(c => !selected.includes(c));
    if (remaining.length === 0) return;
    const random = remaining[Math.floor(Math.random() * remaining.length)];
    addContestant(random);
  };

  const removeContestant = (name) => {
    setSelected(selected.filter(c => c !== name));
  };

  const startSeason = () => {
    if (selected.length < 6) return;
    onStart({ selected, advantages, specialChallenges, finaleFormat });
  };

  return (
    <div className="menu-screen">
      <h2>Create Your Season</h2>

      <input
        placeholder="Search premade cast..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="cast-list">
        {filtered.map(name => (
          <button key={name} onClick={() => addContestant(name)}>{name}</button>
        ))}
      </div>

      <button onClick={addRandom}>Random</button>

      <h3>Selected Cast ({selected.length})</h3>
      <div className="selected-list">
        {selected.map(name => (
          <button key={name} onClick={() => removeContestant(name)}>{name} ✕</button>
        ))}
      </div>

      <div className="toggles">
        <label>
          <input type="checkbox" checked={advantages} onChange={() => setAdvantages(!advantages)} />
          Advantages Enabled
        </label>

        <label>
          <input type="checkbox" checked={specialChallenges} onChange={() => setSpecialChallenges(!specialChallenges)} />
          Special Challenges Enabled
        </label>

        <select value={finaleFormat} onChange={(e) => setFinaleFormat(e.target.value)}>
          <option>Top 2</option>
          <option>Top 3</option>
        </select>
      </div>

      <button className="start-btn" onClick={startSeason}>Start Season</button>
    </div>
  );
}
