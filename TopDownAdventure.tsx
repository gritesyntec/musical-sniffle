import React, { useEffect, useRef, useState } from "react";

const TILE = 32, W = 16, H = 12;
const world = [
  "WWWWWWWWWWWWWWWW",
  "W..............W",
  "W.K...E........W",
  "W...WWWWW......W",
  "W..............W",
  "W..P...........W",
  "WWWWWWWWWWWWWWWW"
];
type Tile = "wall"|"empty"|"player"|"key"|"enemy";
type Entity = { x: number, y: number, type: Tile };

function parseWorld(): [Tile[][], Entity[], Entity[], Entity[]] {
  let tiles: Tile[][] = [], player: Entity[] = [], keys: Entity[] = [], enemies: Entity[] = [];
  for (let y = 0; y < world.length; y++) {
    let row: Tile[] = [];
    for (let x = 0; x < world[y].length; x++) {
      let ch = world[y][x];
      if (ch === "W") row.push("wall");
      else if (ch === "P") { player.push({ x, y, type: "player" }); row.push("empty"); }
      else if (ch === "K") { keys.push({ x, y, type: "key" }); row.push("empty"); }
      else if (ch === "E") { enemies.push({ x, y, type: "enemy" }); row.push("empty"); }
      else row.push("empty");
    }
    tiles.push(row);
  }
  return [tiles, player, keys, enemies];
}

export default function TopDownAdventure() {
  const [tiles, setTiles] = useState<Tile[][]>([]);
  const [player, setPlayer] = useState<Entity>({ x: 2, y: 5, type: "player" });
  const [keys, setKeys] = useState<Entity[]>([]);
  const [enemies, setEnemies] = useState<Entity[]>([]);
  const [hasKey, setHasKey] = useState(false);
  const [msg, setMsg] = useState("Find the key and avoid the enemy!");

  useEffect(() => {
    const [t, p, k, e] = parseWorld();
    setTiles(t); setPlayer(p[0]); setKeys(k); setEnemies(e);
  }, []);

  useEffect(() => {
    const moveEnemy = setInterval(() => {
      setEnemies(enemies => enemies.map(e => {
        let dx = Math.sign(player.x - e.x), dy = Math.sign(player.y - e.y);
        let nx = e.x + (Math.random() > 0.5 ? dx : 0);
        let ny = e.y + (Math.random() > 0.5 ? dy : 0);
        if (tiles[ny][nx] === "wall") return e;
        return { ...e, x: nx, y: ny };
      }));
    }, 1000);
    return () => clearInterval(moveEnemy);
  }, [tiles, player]);

  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      let nx = player.x, ny = player.y;
      if (e.key === "ArrowLeft") nx--;
      if (e.key === "ArrowRight") nx++;
      if (e.key === "ArrowUp") ny--;
      if (e.key === "ArrowDown") ny++;
      if (tiles[ny][nx] === "wall") return;
      setPlayer({ ...player, x: nx, y: ny });
      for (const k of keys) if (k.x === nx && k.y === ny) {
        setKeys([]); setHasKey(true); setMsg("You found the key! Go back to start!");
      }
      for (const en of enemies) if (en.x === nx && en.y === ny) setMsg("Caught by enemy! Game Over.");
      if (hasKey && nx === 1 && ny === 1) setMsg("Victory! You escaped.");
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [tiles, player, keys, hasKey, enemies]);

  return (
    <div style={{ margin: 40 }}>
      <h1>Top-Down Adventure</h1>
      <div style={{display:"grid",gridTemplateColumns:`repeat(${W},${TILE}px)`}}>
        {tiles.map((row, y) => row.map((t, x) => {
          let color = t === "wall" ? "#333" : "#7b9";
          if (player.x === x && player.y === y) color = "#0af";
          if (keys.some(k=>k.x===x&&k.y===y)) color = "#ff0";
          if (enemies.some(en=>en.x===x&&en.y===y)) color = "#e33";
          return <div key={x+"_"+y} style={{width:TILE,height:TILE,background:color,border:"1px solid #222"}} />;
        }))}
      </div>
      <div style={{marginTop:12}}>{msg}</div>
    </div>
  );
}