import { xpForLevel, cumulativeXpForLevel, calculateStreakBonus, REWARDS } from '../src/lib/xp-engine';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    process.exit(1);
  } else {
    console.log(`✅ PASSED: ${message}`);
  }
}

console.log('--- Testing Life RPG XP Engine ---');

// 1. Level 1->2 Base XP
assert(xpForLevel(1) === 100, `Level 1->2 requires 100 XP, got ${xpForLevel(1)}`);

// 2. Monotonic increase test
for (let i = 1; i <= 25; i++) {
  assert(
    xpForLevel(i + 1) > xpForLevel(i),
    `Level ${i + 1} XP (${xpForLevel(i + 1)}) > Level ${i} XP (${xpForLevel(i)})`
  );
}

// 3. Accelerating non-linear curve test
const deltaEarly = xpForLevel(6) - xpForLevel(5);
const deltaLate = xpForLevel(12) - xpForLevel(11);
assert(
  deltaLate > deltaEarly,
  `Curve accelerates: Delta late (${deltaLate}) > Delta early (${deltaEarly})`
);

// 4. Cumulative XP test
assert(cumulativeXpForLevel(1) === 0, 'Cumulative XP for Level 1 is 0');
assert(cumulativeXpForLevel(2) === 100, 'Cumulative XP for Level 2 is 100');
assert(cumulativeXpForLevel(3) === 220, `Cumulative XP for Level 3 is 220, got ${cumulativeXpForLevel(3)}`);

// 5. Streak bonus tests
const today = '2026-09-12';
const yesterday = '2026-09-11';
const twoDaysAgo = '2026-09-10';

const streak1 = calculateStreakBonus(0, null, today);
assert(streak1.newStreak === 1, 'First activity starts streak at 1');

const streak2 = calculateStreakBonus(1, yesterday, today);
assert(streak2.newStreak === 2, 'Consecutive day increments streak to 2');
assert(streak2.streakBonus === 0.1, `Streak of 2 gives +10% bonus, got ${streak2.streakBonus * 100}%`);

const streakBroken = calculateStreakBonus(5, twoDaysAgo, today);
assert(streakBroken.newStreak === 1, 'Missed day resets streak to 1');

const streakMax = calculateStreakBonus(15, yesterday, today);
assert(streakMax.streakBonus === 0.5, 'Streak bonus caps at +50%');

// 6. Rewards mapping
assert(REWARDS.trivial.xp === 5, 'Trivial quest gives 5 XP');
assert(REWARDS.easy.xp === 10, 'Easy quest gives 10 XP');
assert(REWARDS.medium.xp === 20, 'Medium quest gives 20 XP');
assert(REWARDS.hard.xp === 50, 'Hard quest gives 50 XP');
assert(REWARDS.epic.xp === 100, 'Epic quest gives 100 XP');

console.log('🎉 ALL XP ENGINE AND STREAK TESTS PASSED SUCCESSFULLY!');
