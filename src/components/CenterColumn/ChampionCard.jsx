import { motion } from 'framer-motion';
import { TABLE_COLORS, TABLE_NAMES } from '../../utils/constants';

export function ChampionCard({
  tableIndex,
  selectedPlayer,
  selectionRoll,
  onSelectPlayer,
  onSelectionRoll,
  isCompetition,
  die1,
  die2,
  onSetDie1,
  onSetDie2,
}) {
  const color = TABLE_COLORS[tableIndex];
  const name = TABLE_NAMES[tableIndex];
  const sum = die1 != null && die2 != null ? die1 + die2 : null;
  const distance = sum != null ? Math.abs(sum - 7) : null;
  const needsReroll = selectionRoll >= 5 && selectionRoll <= 6;

  return (
    <motion.div
      className="champion-card"
      style={{ '--table-color': color, borderColor: color }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 150, damping: 20 }}
    >
      <div className="champion-card-header">
        <span className="lucky-body">{name}:</span>
        {!isCompetition ? (
          <span className="lucky-numbers champion-player">
            PLAYER {selectedPlayer ?? '?'}
          </span>
        ) : (
          <span className="lucky-numbers champion-player">
            PLAYER {selectedPlayer ?? '?'}
          </span>
        )}
      </div>

      {!isCompetition ? (
        <div className="champion-selection">
          <div className="player-buttons">
            {[1, 2, 3, 4].map((p) => (
              <motion.button
                key={p}
                type="button"
                className={`lucky-btn player-btn ${selectedPlayer === p ? 'selected' : ''}`}
                style={{ borderColor: color }}
                onClick={() => onSelectPlayer(tableIndex, p)}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
              >
                {p}
              </motion.button>
            ))}
          </div>
          <div className="selection-roll">
            <span className="lucky-body">Roll:</span>
            <div className="roll-buttons">
              {[1, 2, 3, 4, 5, 6].map((r) => (
                <motion.button
                  key={r}
                  type="button"
                  className={`lucky-btn roll-btn ${selectionRoll === r ? 'selected' : ''}`}
                  onClick={() => onSelectionRoll(tableIndex, r)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {r}
                </motion.button>
              ))}
            </div>
            {needsReroll && (
              <motion.span
                className="reroll-badge"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                style={{ background: color }}
              >
                REROLL!
              </motion.span>
            )}
          </div>
        </div>
      ) : (
        <div className="champion-competition">
          <div className="dice-inputs">
            <label className="lucky-body">
              Die 1
              <select
                className="lucky-input dice-select"
                value={die1 ?? ''}
                onChange={(e) => onSetDie1(tableIndex, e.target.value ? Number(e.target.value) : null)}
              >
                <option value="">-</option>
                {[1, 2, 3, 4, 5, 6].map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </label>
            <span className="lucky-numbers plus">+</span>
            <label className="lucky-body">
              Die 2
              <select
                className="lucky-input dice-select"
                value={die2 ?? ''}
                onChange={(e) => onSetDie2(tableIndex, e.target.value ? Number(e.target.value) : null)}
              >
                <option value="">-</option>
                {[1, 2, 3, 4, 5, 6].map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </label>
          </div>
          {sum != null && (
            <motion.div
              className="sum-display"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
            >
              <span className="lucky-numbers sum-value">SUM: {sum}</span>
              <span className="lucky-body distance">
                {distance === 0 ? '🎯 PERFECT!' : `${distance} away`}
              </span>
            </motion.div>
          )}
        </div>
      )}
    </motion.div>
  );
}
