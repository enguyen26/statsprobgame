import { motion } from 'framer-motion';
import { ChampionCard } from './ChampionCard';
import { TABLE_COLORS } from '../../utils/constants';

export function SelectionPhase({
  selections,
  selectionRolls,
  setSelection,
  setSelectionRoll,
  allSelectionsReady,
  onAdvance,
}) {
  return (
    <motion.section
      className="center-phase selection-phase"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h2 className="lucky-header phase-title">WHO'S UP?</h2>
      <p className="lucky-body phase-subtitle">Champion Selection</p>
      <div className="champion-cards">
        {[0, 1, 2, 3].map((i) => (
          <ChampionCard
            key={i}
            tableIndex={i}
            selectedPlayer={selections[i]}
            selectionRoll={selectionRolls[i]}
            onSelectPlayer={setSelection}
            onSelectionRoll={setSelectionRoll}
            isCompetition={false}
          />
        ))}
      </div>
      <motion.button
        type="button"
        className="lucky-btn advance-btn"
        disabled={!allSelectionsReady}
        onClick={onAdvance}
        whileHover={allSelectionsReady ? { scale: 1.05 } : {}}
        whileTap={allSelectionsReady ? { scale: 0.98 } : {}}
        style={{
          background: allSelectionsReady
            ? `linear-gradient(135deg, ${TABLE_COLORS[0]}, ${TABLE_COLORS[1]})`
            : 'rgba(255,255,255,0.2)',
        }}
      >
        LET'S ROLL! →
      </motion.button>
    </motion.section>
  );
}
