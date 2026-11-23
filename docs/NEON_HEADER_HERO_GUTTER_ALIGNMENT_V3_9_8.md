# Neon Studio header/hero gutter alignment — preview v3.9.8

Screenshot owner feedback: top-left SD monogram begins farther right than the Technology · Systems · Open source badge. Code confirms different desktop containers: the navigation is limited to max-width 1640px with --wf-gutter; the Neon hero uses width:min(1715px,100% - 112px).

Change (preview only): >=1200px, the entire Neon .topbar .nav matches the Neon .hero width min(1715px, calc(100% - 112px)), centering both in the viewport. This aligns monogram, wordmark and nav underline with the technology badge's left origin and preserves all other nav controls. At <1200px, the former nav width remains to protect responsive controls and available layout.

The SD/Sudip Das/WEB STUDIO wordmark and separate technology pill retain their exact content, styling and vertical placements. No theme other than Neon Studio is changed. Production main stays at 97ff4fd5dded005e6b0d55c42320fe9870624f7b.

Rollback point backup/neon-v3.9.7-before-header-gutter-alignment-2026-11-24 at a67e31bf651a2fc743038f88a7b1de8f32e7d6cc, plus original frozen Neon v3.9.1 backup. New header CSS Git blob 236e3193f79708e94b0426c158c6f378b55ee635; old blob 7d8ebb20a2528fc610c76d1b2fb983dde34398d0. Source geometry calculations passed at 16 viewport widths. Browser screenshot and functional interaction not independently verified. CI credits not used.
