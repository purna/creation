# v1.5 release — Maths Editor
- Added SI dimensional algebra for generic add, multiply, divide and square root, including derived dimensions and incompatible addition diagnostics.
- Calibrated solar-unit operations retain their dedicated validation; generic multiplication/division with solar-scaled units requires explicit SI conversion (not yet provided).
- Compatible Day 1 input sockets highlight after a source is selected; incompatible sockets dim, with reduced-motion support.
- Automated Vitest tests for valid star completion, missing wires, invalid physics, unit mismatches, cycle detection and generic dimensional calculations.
- Bumped Day 1 graph solver version; previously stored evidence is revalidated against the new graph.
- Remaining: CI test integration, end-to-end browser interaction tests, conversion nodes, generalized units for nested groups, and broader challenge solvers.
