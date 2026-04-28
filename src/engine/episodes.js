// Episode Engine: orchestrates full cycle (challenge → drama → vote → elimination)
  const challengeType = generateRandomChallengeType();
  const challenge = runChallenge(active, challengeType);

  state.log.push(`Challenge type: ${challengeType}`);
  state.log.push(`${challenge.winner.name} wins immunity!`);

  const immune = challenge.winner.name;

  // 3. Betrayals may occur
  const betrayalResult = triggerBetrayal(active);
  betrayalResult.events.forEach(e => state.log.push(e));

  // 4. Voting phase
  let voteResult = simulateVoteRound(active);

  // immunity protection
  if (voteResult.eliminated === immune) {
    state.log.push(`${immune} was targeted but has immunity! Re-vote triggered.`);

    const remaining = active.filter(p => p.name !== immune);
    voteResult = simulateVoteRound(remaining);
  }

  // 5. Elimination
  const eliminatedName = voteResult.eliminated;

  state.cast = state.cast.map(p =>
    p.name === eliminatedName
      ? { ...p, status: `OUT ${state.episode}` }
      : p
  );

  state.log.push(`${eliminatedName} is eliminated.`);

  // 6. Check merge
  const remaining = state.cast.filter(p => p.status === 'IN');
  if (remaining.length <= 8) {
    state.merge = true;
    state.log.push('MERGE HAS HAPPENED!');
  }

  // 7. Advance episode
  state.episode += 1;

  return state;
}

export function runFinale(state, format = 'Top 2') {
  const finalists = state.cast.filter(p => p.status === 'IN');

  if (format === 'Top 2') {
    const result = runChallenge(finalists, 'BALANCED');
    const winner = result.winner.name;

    state.log.push(`FINAL WINNER: ${winner}`);
    return { winner };
  }

  if (format === 'Top 3') {
    const sorted = runChallenge(finalists, 'BALANCED').ranking;

    const winner = sorted[0].player.name;
    state.log.push(`FINAL WINNER (Top 3 format): ${winner}`);

    return { winner };
  }
}
