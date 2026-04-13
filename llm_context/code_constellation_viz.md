# Code Source : Visualisation Constellation (Graphique de Force)

Ce document contient le code source de la visualisation "Constellation des Objets", utilisant D3.js et Force-Graph pour cartographier les entités médiatiques.

**Source :** `radar-plus/constellation/index.html`

## Architecture du Front-End
La visualisation repose sur `force-graph.min.js` et utilise un canevas 2D pour le rendu des étoiles et des halos de nœuds.

### Extraits Clés (Logique de rendu)

```javascript
// Configuration du Graphe de Force
const Graph = ForceGraph()(graphEl);
Graph.width(window.innerWidth)
     .height(window.innerHeight)
     .backgroundColor('#00000f')
     .nodeColor(n => nodeColorStr(n.size, n._highlighted))
     .nodeVal(n => Math.max(4, n.size * 0.5))
     .linkDirectionalParticles(l => (l.value||0) >= 3 ? 2 : 0);

// Rendu des Halos (Effet Constellation)
Graph.onRenderFramePre((ctx, gs) => {
  // 1. Dessin des étoiles scintillantes en arrière-plan
  STARS.forEach(s => {
    s.tw += s.ts;
    const a = s.a * (0.55 + 0.45 * Math.sin(s.tw));
    ctx.beginPath();
    ctx.arc(s.x * W, s.y * H, s.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(180,205,255,${a.toFixed(2)})`;
    ctx.fill();
  });

  // 2. Dessin des halos intérieurs et extérieurs autour des nœuds
  nodes.forEach(n => {
    const r = 3 * Math.sqrt(Math.max(4, n.size * 0.5));
    const [nr, ng, nb] = nodeRGB(n.size);
    // Halo dégradé radial
    const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, r * 4);
    g.addColorStop(0, `rgba(${nr},${ng},${nb},0.12)`);
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g; ctx.fill();
  });
});
```

### Logique de Convergence
Le script calcule un score de convergence pour chaque période :
```javascript
function periodConvergenceScore(country, key) {
  const g = graphs[country]?.[key];
  const sizes = g.nodes.map(n => Number(n.size) || 0).sort((a, b) => b - a);
  const ultra = sizes.slice(0, 3).reduce((a, b) => a + b, 0);
  const linksStrong = (g.links || []).reduce((acc, l) => acc + Math.max(0, (Number(l.value) || 0) - 1), 0);
  const density = linksStrong / Math.max(1, g.nodes.length);
  return ultra * 0.75 + linksStrong * 0.95 + density * 1.6;
}
```
