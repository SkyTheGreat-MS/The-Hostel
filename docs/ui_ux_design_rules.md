# UI/UX Design Rules: Unslop AI Designs

Follow these 20 core design principles to ensure interfaces look intentional, human-crafted, and polished rather than generic or AI-generated:

1. **Delete filler badges:** Remove unnecessary pill tags, "New" badges, or decorative status labels that add visual clutter without real value.
2. **Drop redundant labels:** Eliminate labels that merely repeat what is already obvious from the surrounding context or placeholder text.
3. **Unitalicize random words:** Avoid using italics for arbitrary emphasis in headlines or body copy; maintain clean, consistent typography.
4. **Mono only where needed:** Restrict monospace fonts strictly to data, code snippets, or tabular numbers—do not use them as a crutch for a "tech" aesthetic.
5. **Use a design system:** Rely on a cohesive set of tokens for spacing, typography, colors, and borders rather than arbitrary, one-off values.
6. **Show the actual product:** Display real, functional UI screenshots or interactive previews instead of abstract 3D blobs, generic illustrations, or stock graphics.
7. **Enlarge the main feature:** Give the primary value proposition or core interactive element dominant visual hierarchy on the screen.
8. **Group with spacing:** Use whitespace and proximity (Law of Proximity) to organize related elements instead of wrapping everything in heavy borders or cards.
9. **Make headlines specific:** Replace vague, buzzword-heavy AI copy (e.g., "Supercharge your workflow") with concrete, outcome-driven statements.
10. **Emphasize the CTA:** Ensure the primary Call-to-Action stands out clearly through size, contrast, and placement compared to secondary actions.
11. **Add an accent colour:** Use a deliberate, restrained accent color to guide user attention to key interactive elements rather than relying on default gradients.
12. **Keep icons consistent:** Source all icons from a single icon family with uniform stroke weight, corner radius, and sizing.
13. **Remove embellishments:** Strip away unnecessary drop shadows, glowing gradients, background grids, and decorative lines that distract from the content.
14. **Inner radius = outer − padding:** Maintain concentric geometry by calculating nested border radii accurately ($\text{Inner Radius} = \text{Outer Radius} - \text{Padding}$).
15. **Improve text contrast:** Ensure strong, accessible contrast ratios between foreground text and background surfaces for effortless readability.
16. **Wrap headlines properly:** Control line lengths and line breaks (e.g., using `text-wrap: balance`) so headlines avoid awkward single-word orphans.
17. **Align by eye, not pixels:** Adjust optical alignment (such as play icons inside circles or asymmetrical glyphs) so elements *look* centered, not just mathematically centered.
18. **Use tabular nums:** Apply `font-variant-numeric: tabular-nums` to dynamic numbers, prices, and counters so digits don't jitter when updating.
19. **Add loading states:** Provide smooth skeleton loaders, spinners, or optimistic UI transitions so the interface feels responsive during data fetches.
20. **Animate useful feedback:** Use purposeful micro-interactions (like button state transitions or checkmarks) to confirm user actions clearly.