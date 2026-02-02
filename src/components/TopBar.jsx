import { motion } from 'framer-motion';
import { TOTAL_ROUNDS } from '../utils/constants';

export function TopBar({ round, onReset, soundOn, onToggleSound }) {
  const progress = Math.min(1, (round + 1) / TOTAL_ROUNDS);
  return (
    <motion.header
      className="top-bar"
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 200, damping: 25 }}
    >
      <div className="top-bar-round">
        <span className="lucky-header round-label">ROUND</span>
        <span className="lucky-numbers round-value">
          {round + 1}/{TOTAL_ROUNDS}
        </span>
      </div>
      <h1 className="top-bar-title lucky-header">
        LUCKY SEVEN <span aria-hidden>🎲</span>
      </h1>
      <div className="top-bar-actions">
        <motion.button
          type="button"
          className="lucky-btn top-bar-btn sound-btn"
          onClick={onToggleSound}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          aria-label={soundOn ? 'Mute sound' : 'Unmute sound'}
        >
          {soundOn ? '🔊' : '🔇'}
        </motion.button>
        <motion.button
          type="button"
          className="lucky-btn top-bar-btn reset-btn"
          onClick={onReset}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Reset game"
        >
          🔄
        </motion.button>
      </div>
      <div className="rounds-progress-wrap">
        <motion.div
          className="rounds-progress-fill"
          initial={{ width: 0 }}
          animate={{ width: `${progress * 100}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
    </motion.header>
  );
}
