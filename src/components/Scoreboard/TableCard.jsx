import { motion } from 'framer-motion';
import { TABLE_COLORS, TABLE_NAMES } from '../../utils/constants';

export function TableCard({ tableIndex, chips, isLeading, isWinner }) {
  const color = TABLE_COLORS[tableIndex];
  const name = TABLE_NAMES[tableIndex];

  return (
    <motion.div
      className={`scoreboard-card ${isWinner ? 'winner-glow' : ''} ${isLeading ? 'leading-pulse' : ''}`}
      style={{
        '--table-color': color,
        borderColor: color,
        boxShadow: isLeading ? `0 0 24px ${color}80` : undefined,
      }}
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: 'spring', stiffness: 150, damping: 20 }}
      whileHover={{ scale: 1.02 }}
    >
      <div className="scoreboard-card-header">
        <div
          className="scoreboard-card-icon"
          style={{ background: color }}
          aria-hidden
        />
        <span className="lucky-body scoreboard-card-label">{name}</span>
      </div>
      <div className="scoreboard-card-chips">
        <span className="lucky-numbers" aria-hidden>🪙</span>
        <span className="lucky-numbers scoreboard-chip-count">{chips}</span>
      </div>
    </motion.div>
  );
}
