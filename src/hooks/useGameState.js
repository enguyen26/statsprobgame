import { useCallback, useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { PHASES, TOTAL_ROUNDS, CHIPS_PER_WIN, TABLE_NAMES } from '../utils/constants';

const INITIAL_STATE = {
  round: 0,
  phase: PHASES.SELECTION,
  scores: [0, 0, 0, 0],
  selections: [null, null, null, null], // 1-4 per table
  selectionRolls: [null, null, null, null], // last roll 1-6 per table (5-6 = reroll)
  competitionRolls: [null, null, null, null], // { die1, die2 } per table
  winner: null,
  winnerSum: null,
  perfect7: false,
  chipsAwarded: false,
  gameOver: false,
  history: [],
  selectionCounts: Array(16).fill(0), // T1P1..T4P4 flat index = (table*4 + player-1)
  timesSevenRolled: 0,
  currentStreak: { table: null, count: 0 },
  longestStreak: { table: null, count: 0 },
};

function getLeadingTable(scores) {
  const max = Math.max(...scores);
  const idx = scores.indexOf(max);
  return scores.filter((s) => s === max).length === 1 ? idx : null;
}

function getSelectionCountsIndex(tableIndex, player) {
  return tableIndex * 4 + (player - 1);
}

export function useGameState() {
  const [state, setState] = useLocalStorage('lucky-seven-game', INITIAL_STATE);

  const leadingTable = useMemo(() => getLeadingTable(state.scores), [state.scores]);

  const setSelection = useCallback((tableIndex, player) => {
    if (player < 1 || player > 4) return;
    setState((prev) => {
      const next = { ...prev };
      next.selections = [...prev.selections];
      next.selections[tableIndex] = player;
      return next;
    });
  }, [setState]);

  const setSelectionRoll = useCallback((tableIndex, roll) => {
    if (roll < 1 || roll > 6) return;
    setState((prev) => {
      const next = { ...prev };
      next.selectionRolls = [...prev.selectionRolls];
      next.selectionRolls[tableIndex] = roll;
      if (roll >= 1 && roll <= 4) {
        next.selections = [...prev.selections];
        next.selections[tableIndex] = roll;
      }
      return next;
    });
  }, [setState]);

  const allSelectionsReady = useMemo(() => {
    return state.selections.every((s) => s !== null && s >= 1 && s <= 4);
  }, [state.selections]);

  const advanceToCompetition = useCallback(() => {
    setState((prev) => {
      const next = { ...prev, phase: PHASES.COMPETITION };
      next.selectionCounts = [...prev.selectionCounts];
      prev.selections.forEach((player, tableIndex) => {
        if (player >= 1 && player <= 4) {
          const idx = getSelectionCountsIndex(tableIndex, player);
          next.selectionCounts[idx] = (prev.selectionCounts[idx] || 0) + 1;
        }
      });
      return next;
    });
  }, [setState]);

  const setCompetitionRoll = useCallback((tableIndex, die1, die2) => {
    setState((prev) => {
      const next = { ...prev };
      next.competitionRolls = [...prev.competitionRolls];
      next.competitionRolls[tableIndex] =
        die1 != null && die2 != null ? { die1: Number(die1), die2: Number(die2) } : null;
      return next;
    });
  }, [setState]);

  const competitionSums = useMemo(() => {
    return state.competitionRolls.map((r) =>
      r && typeof r === 'object' && r.die1 != null && r.die2 != null
        ? r.die1 + r.die2
        : null
    );
  }, [state.competitionRolls]);

  const allRollsReady = useMemo(() => {
    return state.competitionRolls.every(
      (r) => r && typeof r === 'object' && r.die1 != null && r.die2 != null
    );
  }, [state.competitionRolls]);

  const computeWinner = useCallback(() => {
    const sums = state.competitionRolls.map((r) =>
      r && typeof r === 'object' ? r.die1 + r.die2 : null
    );
    let bestTable = 0;
    let bestDist = Math.abs(sums[0] - 7);
    for (let i = 1; i < 4; i++) {
      const d = Math.abs(sums[i] - 7);
      if (d < bestDist) {
        bestDist = d;
        bestTable = i;
      }
    }
    const winnerSum = sums[bestTable];
    const perfect7 = winnerSum === 7;
    setState((prev) => {
      const next = { ...prev };
      next.phase = PHASES.WINNER;
      next.winner = bestTable;
      next.winnerSum = winnerSum;
      next.perfect7 = perfect7;
      next.timesSevenRolled = prev.timesSevenRolled + (perfect7 ? 1 : 0);
      let streak = { ...prev.currentStreak };
      if (streak.table === bestTable) streak.count += 1;
      else streak = { table: bestTable, count: 1 };
      next.currentStreak = streak;
      if (streak.count > (prev.longestStreak?.count || 0)) {
        next.longestStreak = { ...streak };
      } else {
        next.longestStreak = prev.longestStreak;
      }
      return next;
    });
    return { winner: bestTable, winnerSum, perfect7 };
  }, [state.competitionRolls, setState]);

  const getCompetitionDie1 = (tableIndex) => {
    const r = state.competitionRolls[tableIndex];
    return r && typeof r === 'object' ? r.die1 : null;
  };
  const getCompetitionDie2 = (tableIndex) => {
    const r = state.competitionRolls[tableIndex];
    return r && typeof r === 'object' ? r.die2 : null;
  };

  const awardChips = useCallback(() => {
    if (state.winner == null) return;
    setState((prev) => {
      const next = { ...prev };
      next.scores = [...prev.scores];
      next.scores[prev.winner] += CHIPS_PER_WIN;
      next.chipsAwarded = true;
      return next;
    });
  }, [state.winner, setState]);

  const nextRound = useCallback(() => {
    setState((prev) => {
      const rollSums = prev.competitionRolls.map((r) =>
        r && typeof r === 'object' ? r.die1 + r.die2 : null
      );
      const historyEntry = {
        round: prev.round,
        selections: [...prev.selections],
        rolls: rollSums,
        winner: prev.winner,
        winnerSum: prev.winnerSum,
        perfect7: prev.perfect7,
      };
      const newRound = prev.round + 1;
      const isGameOver = newRound >= TOTAL_ROUNDS;
      return {
        ...prev,
        round: newRound,
        phase: PHASES.SELECTION,
        scores: [...prev.scores],
        history: [...prev.history, historyEntry],
        selections: [null, null, null, null],
        selectionRolls: [null, null, null, null],
        competitionRolls: [null, null, null, null],
        winner: null,
        winnerSum: null,
        perfect7: false,
        chipsAwarded: false,
        currentStreak: { table: null, count: 0 },
        gameOver: isGameOver,
      };
    });
  }, [setState]);

  const resetGame = useCallback((silent = false) => {
    if (silent || window.confirm('Reset the entire game? This cannot be undone.')) {
      setState(INITIAL_STATE);
    }
  }, [setState]);

  const mostSelected = useMemo(() => {
    let max = -1;
    let key = null;
    state.selectionCounts.forEach((c, i) => {
      if (c > max) {
        max = c;
        key = i;
      }
    });
    if (key == null) return null;
    const t = Math.floor(key / 4) + 1;
    const p = (key % 4) + 1;
    return { label: `T${t}-P${p}`, count: max };
  }, [state.selectionCounts]);

  const leastSelected = useMemo(() => {
    let min = Infinity;
    let key = null;
    state.selectionCounts.forEach((c, i) => {
      if (c < min) {
        min = c;
        key = i;
      }
    });
    if (key == null) return null;
    const t = Math.floor(key / 4) + 1;
    const p = (key % 4) + 1;
    return { label: `T${t}-P${p}`, count: min };
  }, [state.selectionCounts]);

  return {
    state,
    leadingTable,
    setSelection,
    setSelectionRoll,
    allSelectionsReady,
    advanceToCompetition,
    setCompetitionRoll,
    getCompetitionDie1,
    getCompetitionDie2,
    allRollsReady,
    computeWinner,
    awardChips,
    nextRound,
    resetGame,
    mostSelected,
    leastSelected,
  };
}
