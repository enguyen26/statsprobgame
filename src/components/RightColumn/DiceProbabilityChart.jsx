import { motion } from 'framer-motion';
import { DICE_PROBABILITIES, DICE_SUMS } from '../../utils/constants';

const BAR_COLORS = [
  '#ff006e',
  '#ff3d6e',
  '#ff6b8a',
  '#00f5ff',
  '#4dffff',
  '#ffbe0b',
  '#06ffa5',
  '#4dffc4',
  '#c478ff',
  '#e0a0ff',
  '#ff9e6d',
];

export function DiceProbabilityChart() {
  const maxP = Math.max(...Object.values(DICE_PROBABILITIES));
  const sevenPct = ((DICE_PROBABILITIES[7] ?? 0) * 100).toFixed(2);

  return (
    <motion.section
      className="right-panel dice-chart"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5 }}
    >
      <h2 className="lucky-header panel-title">DICE PROBABILITY</h2>
      <div className="dice-chart-bars">
        {DICE_SUMS.map((sum, i) => {
          const p = DICE_PROBABILITIES[sum];
          const pct = (p * 100).toFixed(1);
          const isSeven = sum === 7;
          return (
            <motion.div
              key={sum}
              className={`chart-row ${isSeven ? 'highlight-seven' : ''}`}
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: '100%' }}
              transition={{ delay: 0.1 * i }}
            >
              <span className="lucky-body chart-sum">{sum}</span>
              <div className="chart-bar-wrap">
                <motion.div
                  className="chart-bar"
                  style={{
                    background: BAR_COLORS[i] ?? BAR_COLORS[0],
                    width: `${(p / maxP) * 100}%`,
                  }}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.1 * i + 0.2, duration: 0.4 }}
                />
              </div>
              <span className="lucky-body chart-pct">{pct}%</span>
            </motion.div>
          );
        })}
      </div>
      <p className="lucky-body chart-note">
        7 is most likely: <strong>{sevenPct}%</strong>
      </p>
    </motion.section>
  );
}
