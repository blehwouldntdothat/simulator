// Core Simulation Engine

import contestants from '../data/premadeContestants.json';

export function createGameState(selectedNames) {
  const cast = contestants
    .filter(c => selectedNames.includes(c.name))
    .map(c => ({
      ...c,
      status: 'IN',
      alliances: [],
      rivals: [],
      advantages: []
    }));

  return {
    cast,
    episode: 1,
    merge: false,
    log: ['Season begins!']
  };
}

export function getActivePlayers(state) {
  return state.cast.filter(c => c.status === 'IN');
}

function getStatScore(player, type) {
  return player.stats[type] + Math.random() * 3;
}

export function runChallenge(state, type = 'balanced') {
  const active = getActivePlayers(state);

  const scored = active.map(p => {
    let score = 0;

    if (type === 'strength') score = getStatScore(p, 'strength');
    else if (type === 'agility') score = getStatScore(p, 'agility');
    else if (type === 'stamina') score = getStatScore(p, 'stamina');
    else if (type === 'puzzle') score = getStatScore(p, 'puzzle');
    else score = (p.stats.strength + p.stats.agility + p.stats.stamina + p.stats.social + p.stats.puzzle) / 5 + Math.random() * 3;

    // Trait modifiers
    if (p.traits.includes('Athletic') && (type === 'strength' || type === 'agility')) score += 2;
    if (p.traits.includes('Strategist') && type === 'puzzle') score += 2;
    if (p.traits.includes('Asthmatic') && type === 'stamina') score -= 2;
    if (p.traits.includes('Great Singer') && type === 'social') score += 2;

    return { player: p, score };
  });

  scored.sort((a, b) => b.score - a.score);

  return {
    winner: scored[0].player,
    ranking: scored
  };
}

export function eliminatePlayer(state, playerName, episode) {
  state.cast = state.cast.map(p =>
    p.name === playerName
      ? { ...p, status: `OUT ${episode}` }
      : p
  );

  return state;
}

export function runVoting(state) {
  const active = getActivePlayers(state);

  const votes = {};

  active.forEach(voter => {
    const options = active.filter(p => p.name !== voter.name);
    const target = options[Math.floor(Math.random() * options.length)];

    votes[target.name] = (votes[target.name] || 0) + 1;
  });

  const sorted = Object.entries(votes).sort((a, b) => b[1] - a[1]);
  return { votes, eliminated: sorted[0][0] };
}
