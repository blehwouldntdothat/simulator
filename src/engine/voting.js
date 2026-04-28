// Voting + Social Dynamics System
  // Social stat influence
  weights = weights.map(w => ({
    ...w,
    weight: w.weight + (w.target.stats.social / 10)
  }));

  // Normalize
  const total = weights.reduce((sum, w) => sum + w.weight, 0);
  let r = Math.random() * total;

  for (const w of weights) {
    r -= w.weight;
    if (r <= 0) return w.target;
  }

  return candidates[0];
}

export function simulateVoteRound(activePlayers) {
  const votes = {};

  activePlayers.forEach(voter => {
    const options = activePlayers.filter(p => p.name !== voter.name);
    const target = calculateVoteTarget(voter, options);

    votes[target.name] = (votes[target.name] || 0) + 1;
  });

  const sorted = Object.entries(votes).sort((a, b) => b[1] - a[1]);

  return {
    votes,
    eliminated: sorted[0][0],
    fullResults: sorted
  };
}

export function applyAllianceFormation(players) {
  // Random chance alliances form based on social stat
  players.forEach(p => {
    players.forEach(other => {
      if (p.name === other.name) return;

      const chance = (p.stats.social + other.stats.social) / 200;

      if (Math.random() < chance && !p.alliances.includes(other.name)) {
        p.alliances.push(other.name);
      }
    });
  });

  return players;
}

export function applyRivalries(players) {
  players.forEach(p => {
    players.forEach(other => {
      if (p.name === other.name) return;

      const conflictChance = (10 - p.stats.social + 10 - other.stats.social) / 300;

      if (Math.random() < conflictChance && !p.rivals.includes(other.name)) {
        p.rivals.push(other.name);
      }
    });
  });

  return players;
}

export function checkIdolPlay(player, votesReceived) {
  if (!player.advantages.includes('idol')) return false;

  // Plays idol if high risk
  return votesReceived >= 2 && Math.random() < 0.7;
}
