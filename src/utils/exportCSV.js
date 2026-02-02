/**
 * Export game history and stats to CSV for analysis.
 */
export function exportGameToCSV(history, scores, tableNames) {
  const headers = [
    'Round',
    'Table1_Player',
    'Table2_Player',
    'Table3_Player',
    'Table4_Player',
    'Table1_Sum',
    'Table2_Sum',
    'Table3_Sum',
    'Table4_Sum',
    'Winner_Table',
    'Winner_Sum',
    'Perfect7',
  ];
  const rows = history.map((h) => [
    h.round + 1,
    h.selections?.[0] ?? '',
    h.selections?.[1] ?? '',
    h.selections?.[2] ?? '',
    h.selections?.[3] ?? '',
    h.rolls?.[0] ?? '',
    h.rolls?.[1] ?? '',
    h.rolls?.[2] ?? '',
    h.rolls?.[3] ?? '',
    h.winner != null ? (tableNames?.[h.winner] ?? `Table ${h.winner + 1}`) : '',
    h.winnerSum ?? '',
    h.perfect7 ? 'Yes' : 'No',
  ]);
  const finalScores = ['Final Scores', ...scores];
  const csvContent = [
    headers.join(','),
    ...rows.map((r) => r.join(',')),
    '',
    finalScores.join(','),
  ].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `lucky-seven-game-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
