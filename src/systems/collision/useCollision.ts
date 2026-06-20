export const NPC_POSITION: [number, number] = [5, -4.2];
export const GATE_POSITION: [number, number] = [33, -4.2];

export function checkNpcProximity(px: number, py: number): boolean {
  const dx = px - NPC_POSITION[0];
  const dy = py - NPC_POSITION[1];
  return Math.sqrt(dx * dx + dy * dy) < 2.4;
}

export function checkGateProximity(px: number, py: number): boolean {
  const dx = px - GATE_POSITION[0];
  const dy = py - GATE_POSITION[1];
  return Math.sqrt(dx * dx + dy * dy) < 2.2;
}
