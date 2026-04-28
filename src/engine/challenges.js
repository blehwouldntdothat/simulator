// Challenge System: types, scoring, special events
  }

  // trait bonuses / penalties
  if (type === CHALLENGE_TYPES.MUSICAL && player.traits.includes('Great Singer')) {
    mod += 4;
  }

  if (type === CHALLENGE_TYPES.ENDURANCE && player.traits.includes('Asthmatic')) {
    mod -= 3;
  }

  if (player.traits.includes('Athletic') && (type === CHALLENGE_TYPES.STRENGTH || type === CHALLENGE_TYPES.AGILITY)) {
    mod += 2;
  }

  return mod + Math.random() * 5;
}

export function runChallenge(players, type = CHALLENGE_TYPES.BALANCED) {
  const results = players.map(p => ({
    player: p,
    score: getChallengeModifier(p, type)
  }));

  results.sort((a, b) => b.score - a.score);

  return {
    winner: results[0].player,
    ranking: results
  };
}

export function runTeamChallenge(teams, type) {
  const teamScores = teams.map(team => {
    const score = team.reduce((sum, p) => {
      return sum + getChallengeModifier(p, type);
    }, 0);

    return { team, score };
  });

  teamScores.sort((a, b) => b.score - a.score);

  return {
    winningTeam: teamScores[0].team,
    losingTeam: teamScores[teamScores.length - 1].team
  };
}

export function suddenDeathElimination(players, type = CHALLENGE_TYPES.SUDDEN_DEATH) {
  const results = runChallenge(players, type).ranking;

  const eliminated = results[results.length - 1].player;

  return {
    eliminated,
    ranking: results
  };
}

export function tieBreaker(players, type = CHALLENGE_TYPES.PUZZLE) {
  return runChallenge(players, type).winner;
}

export function generateRandomChallengeType() {
  const types = Object.values(CHALLENGE_TYPES);
  return types[Math.floor(Math.random() * types.length)];
}
