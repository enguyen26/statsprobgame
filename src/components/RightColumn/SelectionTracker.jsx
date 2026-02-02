import { motion } from 'framer-motion';
import { TABLE_COLORS } from '../../utils/constants';

export function SelectionTracker({
  selectionCounts,
  mostSelected,
  leastSelected,
  currentSelections,
}) {
  const maxCount = Math.max(...selectionCounts, 1);
  const grid = [];
  for (let t = 0; t < 4; t++) {
    for (let p = 1; p <= 4; p++) {
      const idx = t * 4 + (p - 1);
      const count = selectionCounts[idx] ?? 0;
      const isCurrent =
        currentSelections &&
        currentSelections[t] === p;
      grid.push({
        key: `T${t + 1}-P${p}`,
        label: `T${t + 1}-P${p}`,
        count,
        color: TABLE_COLORS[t],
        intensity: maxCount > 0 ? count / maxCount : 0,
        isCurrent,
      });
    }
  }

  return (
    <motion.section
      className="right-panel selection-tracker"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 }}
    >
      <h2 className="lucky-header panel-title">SELECTION FREQUENCY</h2>
      <div className="selection-grid">
        {grid.map((cell) => (
          <motion.div
            key={cell.key}
            className={`selection-cell ${cell.isCurrent ? 'current' : ''}`}
            style={{
              '--cell-color': cell.color,
              background: `rgba(${hexToRgb(cell.color)}, ${0.2 + cell.intensity * 0.6})`,
              borderColor: cell.color,
            }}
            whileHover={{ scale: 1.05 }}
          >
            <span className="lucky-body cell-label">{cell.label}</span>
            <span className="lucky-numbers cell-count">{cell.count}</span>
          </motion.div>
        ))}
      </div>
      <div className="selection-extremes">
        {mostSelected && (
          <p className="lucky-body">
            <strong>Most:</strong> {mostSelected.label} ({mostSelected.count})
          </p>
        )}
        {leastSelected && (
          <p className="lucky-body">
            <strong>Least:</strong> {leastSelected.label} ({leastSelected.count})
          </p>
        )}
      </div>
    </motion.section>
  );
}

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r}, ${g}, ${b}`;
}
