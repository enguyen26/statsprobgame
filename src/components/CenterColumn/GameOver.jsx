import { motion } from 'framer-motion';
import { TABLE_NAMES, TABLE_COLORS } from '../../utils/constants';

export function GameOver({ scores, onReset }) {
  const ranked = scores
    .map((s, i) => ({ table: i, score: s }))
    .sort((a, b) => b.score - a.score);

  return (
    <motion.section
      className="center-phase game-over-phase"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 150, damping: 20 }}
    >
      <motion.div
        className="game-over-card"
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 25 }}
      >
        <h2 className="lucky-header game-over-title">🎉 GAME OVER 🎉</h2>
        <p className="lucky-body game-over-subtitle">Final Scoreboard</p>
        <div className="game-over-standings">
          {ranked.map((r, i) => (
            <motion.div
              key={r.table}
              className="standing-row"
              style={{ borderColor: TABLE_COLORS[r.table] }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * i }}
            >
              <span className="lucky-numbers standing-rank">#{i + 1}</span>
              <span className="lucky-body standing-name">{TABLE_NAMES[r.table]}</span>
              <span className="lucky-numbers standing-score">🪙 {r.score}</span>
            </motion.div>
          ))}
        </div>
        <motion.button
          type="button"
          className="lucky-btn play-again-btn"
          onClick={onReset}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          style={{
            background: 'linear-gradient(135deg, #ff006e, #00f5ff)',
            marginTop: '1.5rem',
          }}
        >
          Play Again
        </motion.button>
      </motion.div>
    </motion.section>
  );
}
