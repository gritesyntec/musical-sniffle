import javax.swing.*;
import java.awt.*;
import java.awt.event.*;
import java.util.Random;

public class RoguelikeDungeonCrawler extends JPanel implements KeyListener {
    char[][] map = new char[12][20];
    int px=1, py=1, hp=10, gold=0;
    Random rnd = new Random();

    public RoguelikeDungeonCrawler() {
        JFrame f = new JFrame("Roguelike Dungeon Crawler");
        f.setSize(460,320);
        f.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        f.add(this); f.setVisible(true);
        genMap();
        addKeyListener(this);
        setFocusable(true);
    }
    void genMap() {
        for(int y=0;y<12;y++)
            for(int x=0;x<20;x++)
                map[y][x]=(x==0||y==0||x==19||y==11)?'#':'.';
        map[1][1]='@';
        for(int i=0;i<10;i++) map[rnd.nextInt(10)+1][rnd.nextInt(18)+1]='G';
        for(int i=0;i<6;i++) map[rnd.nextInt(10)+1][rnd.nextInt(18)+1]='E';
    }
    public void paintComponent(Graphics g) {
        super.paintComponent(g);
        for(int y=0;y<12;y++)
            for(int x=0;x<20;x++){
                if(map[y][x]=='#') g.setColor(Color.DARK_GRAY);
                else if(map[y][x]=='.') g.setColor(Color.LIGHT_GRAY);
                else if(map[y][x]=='@') g.setColor(Color.BLUE);
                else if(map[y][x]=='G') g.setColor(Color.YELLOW);
                else if(map[y][x]=='E') g.setColor(Color.RED);
                g.fillRect(x*22,y*22,22,22);
            }
        g.setColor(Color.BLACK);
        g.drawString("HP: "+hp+"  Gold: "+gold, 10, 15);
    }
    void move(int dx, int dy) {
        int nx=px+dx, ny=py+dy;
        if(map[ny][nx]=='#')return;
        if(map[ny][nx]=='G'){ gold++; }
        if(map[ny][nx]=='E'){ hp--; }
        map[py][px]='.';
        px=nx; py=ny; map[py][px]='@';
        repaint();
    }
    public void keyPressed(KeyEvent e) {
        if(hp<=0)return;
        if(e.getKeyCode()==KeyEvent.VK_LEFT)move(-1,0);
        if(e.getKeyCode()==KeyEvent.VK_RIGHT)move(1,0);
        if(e.getKeyCode()==KeyEvent.VK_UP)move(0,-1);
        if(e.getKeyCode()==KeyEvent.VK_DOWN)move(0,1);
    }
    public void keyReleased(KeyEvent e) {}
    public void keyTyped(KeyEvent e) {}
    public static void main(String[] args){ new RoguelikeDungeonCrawler(); }
}