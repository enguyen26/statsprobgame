import { useEffect } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { TABLE_COLORS, TABLE_NAMES, CHIPS_PER_WIN, DICE_FACES } from '../../utils/constants';

export function WinnerAnnouncement({
  winner,
  winnerSum,
  perfect7,
  competitionRolls,
  onAwardChips,
  onNextRound,
  chipsAwarded,
  soundOn,
}) {
  const color = winner != null ? TABLE_COLORS[winner] : null;
  const name = winner != null ? TABLE_NAMES[winner] : '';
  const roll = winner != null && competitionRolls[winner] ? competitionRolls[winner] : null;
  const die1 = roll && typeof roll === 'object' ? roll.die1 : null;
  const die2 = roll && typeof roll === 'object' ? roll.die2 : null;

  useEffect(() => {
    if (winner == null) return;
    const burst = (left, right) => {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { x: left, y: 0.6 },
        colors: TABLE_COLORS,
      });
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { x: right, y: 0.6 },
        colors: TABLE_COLORS,
      });
    };
    burst(0.2, 0.8);
    if (perfect7) {
      setTimeout(() => {
        confetti({ particleCount: 120, spread: 100, origin: { y: 0.5 } });
      }, 300);
    }
  }, [winner, perfect7]);

  return (
    <motion.section
      className="center-phase winner-phase"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
    >
      <motion.div
        className="winner-card"
        style={{ '--winner-color': color, borderColor: color }}
        initial={{ scale: 0.5 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
      >
        <h2 className="lucky-header winner-title">
          🎉 {name} WINS! 🎉
        </h2>
        {perfect7 && (
          <motion.span
            className="perfect-badge"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 300 }}
          >
            PERFECT 7!
          </motion.span>
        )}
        <div className="winner-roll">
          {die1 != null && die2 != null && (
            <span className="lucky-numbers dice-display">
              {DICE_FACES[die1 - 1]} + {DICE_FACES[die2 - 1]} = {winnerSum}
            </span>
          )}
        </div>
        <motion.div
          className="chips-award"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          +{CHIPS_PER_WIN} CHIPS 🪙
        </motion.div>
      </motion.div>
      <div className="winner-actions">
        {!chipsAwarded ? (
          <motion.button
            type="button"
            className="lucky-btn award-btn"
            onClick={onAwardChips}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            style={{
              background: `linear-gradient(135deg, ${color}, var(--accent-yellow))`,
            }}
          >
            AWARD CHIPS
          </motion.button>
        ) : (
          <motion.button
            type="button"
            className="lucky-btn next-round-btn"
            onClick={onNextRound}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            style={{
              background: 'linear-gradient(135deg, #00f5ff, #06ffa5)',
            }}
          >
            NEXT ROUND ➜
          </motion.button>
        )}
      </div>
    </motion.section>
  );
}
