/**
 * Shared mutable state read every frame by the 3D scene.
 * Kept outside React so scroll / mouse updates never trigger re-renders.
 */
export const treeState = {
  /** 0 → 1, animated once after the intro loader */
  intro: 0,
  /** 0 → 1, scroll progress through the hero + about sections */
  scroll: 0,
  /** Pointer position, -1 → 1 */
  mx: 0,
  my: 0,
}

/** Overall growth used by the tree and the hero readout */
export const growth = () => Math.min(1, treeState.intro * 0.62 + treeState.scroll * 0.38)
