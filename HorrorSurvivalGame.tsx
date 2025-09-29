import React, { useEffect, useState } from "react";
const W = 10, H = 8;
function randomPos() {
  return { x: Math.floor(Math.random() * W), y: Math.floor(Math.random() * H) };
}
export default function HorrorSurvivalGame() {
  const [player, setPlayer] = useState({ x: 0, y: 0 });
  const [monster, setMonster] = useState(randomPos());
  const [msg, setMsg] = useState("Survive! Move with arrows.");
  const [alive, setAlive] = useState(true);
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (!alive) return;
      let nx = player.x, ny = player.y;
      if (e.key === "ArrowLeft") nx--;
      if (e.key === "ArrowRight") nx++;
      if (e.key === "ArrowUp") ny--;
      if (e.key === "ArrowDown") ny++;
      nx = Math.max(0, Math.min(W - 1, nx));
      ny = Math.max(0, Math.min(H - 1, ny));
      setPlayer({ x: nx, y: ny });
      if (nx === monster.x && ny === monster.y) {
        setMsg("Caught! Game Over."); setAlive(false);
      } else {
        setMsg("You move..."); // Monster moves
        setTimeout(() => {
          setMonster(m => {
            let dx = Math.sign(nx - m.x), dy = Math.sign(ny - m.y);
            let mx = m.x + (Math.random() > 0.5 ? dx : 0);
            let my = m.y + (Math.random() > 0.5 ? dy : 0);
            mx = Math.max(0, Math.min(W - 1, mx));
            my = Math.max(0, Math.min(H - 1, my));
            if (mx === nx && my === ny) {
              setMsg("Monster caught you! Game Over.");
              setAlive(false);
            }
            return { x: mx, y: my };
          });
        }, 300);
      }
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [player, monster, alive]);
  return (
    <div style={{ margin: 40 }}>
      <h1>Horror Survival Game</h1>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${W},40px)` }}>
        {[...Array(H)].map((_, y) =>
          [...Array(W)].map((_, x) => {
            let color = "#222";
            if (player.x === x && player.y === y) color = "#0f0";
            if (monster.x === x && monster.y === y) color = "#e33";
            return <div key={x + "_" + y} style={{
              width: 40, height: 40, background: color, border: "1px solid #444"
            }} />;
          })
        )}
      </div>
      <div style={{ marginTop: 16 }}>{msg}</div>
    </div>
  );
}