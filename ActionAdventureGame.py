import pygame, sys, random

WIDTH, HEIGHT = 640, 480
TILE = 32

pygame.init()
screen = pygame.display.set_mode((WIDTH, HEIGHT))
clock = pygame.time.Clock()
font = pygame.font.SysFont(None, 32)

world = [
    "WWWWWWWWWWWWWWWW",
    "W..............W",
    "W....K.........W",
    "W..WWW...E.....W",
    "W..W.W.........W",
    "W..W.WWWWWW....W",
    "W..W.......W...W",
    "W..P.......W...W",
    "WWWWWWWWWWWWWWWW"
]

tiles = []
for y, row in enumerate(world):
    line = []
    for x, ch in enumerate(row):
        if ch == "W":
            line.append("wall")
        elif ch == "P":
            px, py = x, y
            line.append("empty")
        elif ch == "E":
            ex, ey = x, y
            line.append("empty")
        elif ch == "K":
            kx, ky = x, y
            line.append("key")
        else:
            line.append("empty")
    tiles.append(line)

has_key = False

def draw():
    for y in range(len(tiles)):
        for x in range(len(tiles[y])):
            rect = pygame.Rect(x*TILE, y*TILE, TILE, TILE)
            if tiles[y][x] == "wall":
                pygame.draw.rect(screen, (60,60,60), rect)
            elif tiles[y][x] == "key":
                pygame.draw.rect(screen, (255,215,0), rect)
            else:
                pygame.draw.rect(screen, (30,110,40), rect)
    pygame.draw.rect(screen, (0,200,250), (px*TILE, py*TILE, TILE, TILE))
    pygame.draw.rect(screen, (250,0,0), (ex*TILE, ey*TILE, TILE, TILE))
    if has_key:
        screen.blit(font.render("Key Obtained!", 1, (255,220,0)), (10, HEIGHT-40))

def move(dx, dy):
    global px, py, has_key
    nx, ny = px+dx, py+dy
    if tiles[ny][nx] != "wall":
        px, py = nx, ny
        if tiles[py][px] == "key":
            has_key = True
            tiles[py][px] = "empty"

def enemy_move():
    global ex, ey
    dx = 1 if px > ex else -1 if px < ex else 0
    dy = 1 if py > ey else -1 if py < ey else 0
    if tiles[ey+dy][ex+dx] != "wall":
        ex += dx; ey += dy

def main():
    global px, py
    running = True
    while running:
        screen.fill((0,0,0))
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                running = False
        keys = pygame.key.get_pressed()
        if keys[pygame.K_LEFT]: move(-1,0)
        if keys[pygame.K_RIGHT]: move(1,0)
        if keys[pygame.K_UP]: move(0,-1)
        if keys[pygame.K_DOWN]: move(0,1)
        if random.random()<0.08: enemy_move()
        draw()
        if px==ex and py==ey:
            screen.blit(font.render("Caught by Enemy! Game Over.", 1, (255,0,0)), (140, HEIGHT//2))
            pygame.display.flip(); pygame.time.wait(2000); return
        if has_key and px==1 and py==1:
            screen.blit(font.render("You Escaped! Victory!", 1, (0,255,0)), (170, HEIGHT//2))
            pygame.display.flip(); pygame.time.wait(2000); return
        pygame.display.flip()
        clock.tick(10)
if __name__ == "__main__":
    main()
    pygame.quit()
    sys.exit()