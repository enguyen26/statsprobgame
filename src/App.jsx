import { useState, useEffect, useCallback } from 'react';
import { useGameState } from './hooks/useGameState';
import { TopBar } from './components/TopBar';
import { Scoreboard } from './components/Scoreboard/Scoreboard';
import { SelectionPhase } from './components/CenterColumn/SelectionPhase';
import { CompetitionPhase } from './components/CenterColumn/CompetitionPhase';
import { WinnerAnnouncement } from './components/CenterColumn/WinnerAnnouncement';
import { GameOver } from './components/CenterColumn/GameOver';
import { SelectionTracker } from './components/RightColumn/SelectionTracker';
import { GameStats } from './components/RightColumn/GameStats';
import { DiceProbabilityChart } from './components/RightColumn/DiceProbabilityChart';
import { PHASES, TABLE_NAMES } from './utils/constants';
import { exportGameToCSV } from './utils/exportCSV';
import './App.css';

export default function App() {
  const [soundOn, setSoundOn] = useState(true);
  const {
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
  } = useGameState();

  const handleKeyDown = useCallback(
    (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'TEXTAREA') return;
      switch (e.key.toLowerCase()) {
        case 'r':
          if (!e.ctrlKey && !e.metaKey) resetGame();
          break;
        case 'm':
          setSoundOn((s) => !s);
          break;
        case ' ':
          e.preventDefault();
          if (state.phase === PHASES.WINNER && state.chipsAwarded) nextRound();
          break;
        default:
          break;
      }
    },
    [state.phase, state.chipsAwarded, resetGame, nextRound]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleExportCSV = useCallback(() => {
    exportGameToCSV(state.history, state.scores, TABLE_NAMES);
  }, [state.history, state.scores]);

  const lastWinner = state.phase === PHASES.WINNER ? state.winner : null;

  return (
    <div className="app">
      <TopBar
        round={state.round}
        onReset={resetGame}
        soundOn={soundOn}
        onToggleSound={() => setSoundOn((s) => !s)}
      />
      <main className="main-content">
        <aside className="column left-column">
          <Scoreboard
            scores={state.scores}
            leadingTable={leadingTable}
            lastWinner={lastWinner}
          />
        </aside>
        <section className="column center-column">
          {state.gameOver && (
            <GameOver scores={state.scores} onReset={() => resetGame(true)} />
          )}
          {!state.gameOver && state.phase === PHASES.SELECTION && (
            <SelectionPhase
              selections={state.selections}
              selectionRolls={state.selectionRolls}
              setSelection={setSelection}
              setSelectionRoll={setSelectionRoll}
              allSelectionsReady={allSelectionsReady}
              onAdvance={advanceToCompetition}
            />
          )}
          {!state.gameOver && state.phase === PHASES.COMPETITION && (
            <CompetitionPhase
              selections={state.selections}
              getCompetitionDie1={getCompetitionDie1}
              getCompetitionDie2={getCompetitionDie2}
              setCompetitionRoll={setCompetitionRoll}
              allRollsReady={allRollsReady}
              onRevealWinner={computeWinner}
            />
          )}
          {!state.gameOver && state.phase === PHASES.WINNER && (
            <WinnerAnnouncement
              winner={state.winner}
              winnerSum={state.winnerSum}
              perfect7={state.perfect7}
              competitionRolls={state.competitionRolls}
              onAwardChips={awardChips}
              onNextRound={nextRound}
              chipsAwarded={state.chipsAwarded}
              soundOn={soundOn}
            />
          )}
        </section>
        <aside className="column right-column">
          <SelectionTracker
            selectionCounts={state.selectionCounts}
            mostSelected={mostSelected}
            leastSelected={leastSelected}
            currentSelections={state.selections}
          />
          <GameStats
            timesSevenRolled={state.timesSevenRolled}
            currentStreak={state.currentStreak}
            longestStreak={state.longestStreak}
            scores={state.scores}
            round={state.round}
            totalRounds={10}
          />
          <DiceProbabilityChart />
          <button
            type="button"
            className="lucky-btn export-btn"
            onClick={handleExportCSV}
          >
            Export CSV
          </button>
        </aside>
      </main>
    </div>
  );
}
