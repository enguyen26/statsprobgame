import { motion } from 'framer-motion';
import { ChampionCard } from './ChampionCard';

export function CompetitionPhase({
  selections,
  getCompetitionDie1,
  getCompetitionDie2,
  setCompetitionRoll,
  allRollsReady,
  onRevealWinner,
}) {
  const setDie1 = (tableIndex, val) => {
    const d2 = getCompetitionDie2(tableIndex);
    setCompetitionRoll(tableIndex, val, d2);
  };
  const setDie2 = (tableIndex, val) => {
    const d1 = getCompetitionDie1(tableIndex);
    setCompetitionRoll(tableIndex, d1, val);
  };

  return (
    <motion.section
      className="center-phase competition-phase"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h2 className="lucky-header phase-title">LET'S ROLL!</h2>
      <div className="champion-cards">
        {[0, 1, 2, 3].map((i) => (
          <ChampionCard
            key={i}
            tableIndex={i}
            selectedPlayer={selections[i]}
            isCompetition
            die1={getCompetitionDie1(i)}
            die2={getCompetitionDie2(i)}
            onSetDie1={setDie1}
            onSetDie2={setDie2}
          />
        ))}
      </div>
      <motion.button
        type="button"
        className="lucky-btn reveal-winner-btn"
        disabled={!allRollsReady}
        onClick={onRevealWinner}
        whileHover={allRollsReady ? { scale: 1.05 } : {}}
        whileTap={allRollsReady ? { scale: 0.98 } : {}}
      >
        REVEAL WINNER 🏆
      </motion.button>
    </motion.section>
  );
}
