import { motion } from 'framer-motion';
import { TABLE_NAMES, TABLE_COLORS } from '../../utils/constants';

export function GameStats({
  timesSevenRolled,
  currentStreak,
  longestStreak,
  scores,
  round,
  totalRounds,
}) {
  const totalChips = scores.reduce((a, b) => a + b, 0);
  const expectedPerTable = totalChips > 0 ? totalChips / 4 : 0;
  const maxScore = Math.max(...scores, 1);
  const fairGameIndex =
    totalChips > 0
      ? Math.min(
          100,
          Math.max(
            0,
            Math.round(
              (1 -
                scores.reduce((acc, s) => acc + Math.abs(s - expectedPerTable), 0) /
                  (totalChips * 2)) *
                100
            )
          )
        )
      : 100;

  return (
    <motion.section
      className="right-panel game-stats"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.4 }}
    >
      <h2 className="lucky-header panel-title">GAME STATS</h2>
      <div className="stat-cards">
        <motion.div
          className="stat-card"
          whileHover={{ scale: 1.02 }}
        >
          <span className="lucky-body stat-label">Times 7 rolled</span>
          <span className="lucky-numbers stat-value">{timesSevenRolled}</span>
        </motion.div>
        <motion.div
          className="stat-card"
          whileHover={{ scale: 1.02 }}
        >
          <span className="lucky-body stat-label">Current streak</span>
          <span className="lucky-numbers stat-value">
            {currentStreak?.table != null
              ? `${TABLE_NAMES[currentStreak.table]} × ${currentStreak.count}`
              : '-'}
          </span>
        </motion.div>
        <motion.div
          className="stat-card"
          whileHover={{ scale: 1.02 }}
        >
          <span className="lucky-body stat-label">Longest streak</span>
          <span className="lucky-numbers stat-value">
            {longestStreak?.table != null
              ? `${TABLE_NAMES[longestStreak.table]} × ${longestStreak.count}`
              : '-'}
          </span>
        </motion.div>
        <motion.div
          className="stat-card distribution"
          whileHover={{ scale: 1.02 }}
        >
          <span className="lucky-body stat-label">Chip distribution</span>
          <div className="mini-bars">
            {scores.map((s, i) => (
              <div
                key={i}
                className="mini-bar-wrap"
                title={`${TABLE_NAMES[i]}: ${s}`}
              >
                <div
                  className="mini-bar"
                  style={{
                    width: `${maxScore > 0 ? (s / maxScore) * 100 : 0}%`,
                    background: TABLE_COLORS[i],
                  }}
                />
              </div>
            ))}
          </div>
        </motion.div>
        <motion.div
          className="stat-card fair"
          whileHover={{ scale: 1.02 }}
        >
          <span className="lucky-body stat-label">Fair Game Index</span>
          <span className="lucky-numbers stat-value">{fairGameIndex}%</span>
        </motion.div>
      </div>
    </motion.section>
  );
}
