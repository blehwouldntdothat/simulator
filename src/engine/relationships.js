// Relationships System: friendships, trust, betrayal, drama engine

export function initRelationships(players) {
  players.forEach(p => {
    p.relationships = {};

    players.forEach(other => {
      if (p.name === other.name) return;

      // base neutral relationship (-5 to +5)
      p.relationships[other.name] = Math.floor(Math.random() * 11) - 5;
    });
  });

  return players;
}

export function updateRelationship(players, aName, bName, change) {
  const a = players.find(p => p.name === aName);
  const b = players.find(p => p.name === bName);

  if (!a || !b) return players;

  a.relationships[bName] = (a.relationships[bName] || 0) + change;
  b.relationships[aName] = (b.relationships[aName] || 0) + change;

  return players;
}

export function decayRelationships(players) {
  players.forEach(p => {
    Object.keys(p.relationships || {}).forEach(other => {
      // slowly drift toward neutral
      if (p.relationships[other] > 0) p.relationships[other] -= 0.2;
      if (p.relationships[other] < 0) p.relationships[other] += 0.2;
    });
  });

  return players;
}

export function generateConfessionalDrama(players) {
  const lines = [];

  players.forEach(p => {
    const targets = Object.entries(p.relationships || {});
    if (targets.length === 0) return;

    const worst = targets.sort((a, b) => a[1] - b[1])[0];
    const best = targets.sort((a, b) => b[1] - a[1])[0];

    if (worst && worst[1] < -4) {
      lines.push(`${p.name} says: "I cannot stand ${worst[0]} anymore."`);
    }

    if (best && best[1] > 6) {
      lines.push(`${p.name} says: "I trust ${best[0]} the most here."`);
    }
  });

  return lines;
}

export function triggerBetrayal(players) {
  const events = [];

  players.forEach(p => {
    Object.entries(p.relationships || {}).forEach(([other, value]) => {
      if (value < -6 && Math.random() < 0.1) {
        events.push(`${p.name} betrays ${other}!`);

        p.relationships[other] -= 3;
      }
    });
  });

  return { players, events };
}
