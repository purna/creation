# Creation Studio v1.3 — Day 1 graph integration
- Day 1 uses five typed, labelled input nodes, seven dedicated formula nodes, and one final output. All begin unwired.
- The formulas compute gravity, compression, ideal-gas core pressure proxy, fusion power, hydrostatic residual, thermal residual and maximum residual.
- Each challenge requires both its correct input connections and passing the physical validator. The final stability challenge requires an output connection.
- Disconnected, incorrectly connected, invalid-value and cyclic graphs cannot unlock Day 2.
- Saving and loading recomputes evidence from the graph; v1.2 star-only progress no longer grants unlock.
- The existing simplified solar-calibrated stellar solver is not a full stellar evolution model. Stability is tested over a finite numerical window.
- Days 2–6 still require their own physics validators. Firebase cloud sign-in still requires project configuration.
