using System;
using System.Drawing;
using System.Windows.Forms;
using System.Collections.Generic;

namespace Sidescroller2D
{
    public partial class Sidescroller2D : Form
    {
        int px=60, py=300, vx=0, vy=0;
        bool left, right, jump;
        List<Rectangle> plats = new List<Rectangle> {
            new Rectangle(0,380,720,40),
            new Rectangle(140,300,100,16),
            new Rectangle(320,220,100,16),
            new Rectangle(540,160,100,16)
        };
        Timer timer=new Timer();

        public Sidescroller2D()
        {
            InitializeComponent();
            this.Width=740; this.Height=460; DoubleBuffered=true;
            timer.Interval=16; timer.Tick+=(s,e)=>{ UpdateGame(); Invalidate(); };
            timer.Start();
            KeyDown+=(s,e)=>{ if(e.KeyCode==Keys.Left)left=true; if(e.KeyCode==Keys.Right)right=true; if(e.KeyCode==Keys.Space&&!jump){vy=-14;jump=true;} };
            KeyUp+=(s,e)=>{ if(e.KeyCode==Keys.Left)left=false; if(e.KeyCode==Keys.Right)right=false; };
            Text="2D Sidescroller";
        }
        protected override void OnPaint(PaintEventArgs e)
        {
            base.OnPaint(e);
            e.Graphics.Clear(Color.LightSkyBlue);
            e.Graphics.FillRectangle(Brushes.Orange, px, py, 32, 32);
            foreach(var p in plats) e.Graphics.FillRectangle(Brushes.ForestGreen,p);
        }
        void UpdateGame()
        {
            vx=0; if(left)vx=-5; if(right)vx=5; vy+=1; px+=vx; py+=vy;
            foreach(var p in plats){
                if(new Rectangle(px,py,32,32).IntersectsWith(p)){
                    if(vy>0){py=p.Y-32;vy=0;jump=false;}
                    else if(vy<0){py=p.Y+p.Height;vy=0;}
                }
            }
            if(py>400){px=60;py=300;}
        }
        [STAThread]
        public static void Main()
        {
            Application.EnableVisualStyles();
            Application.Run(new Sidescroller2D());
        }
    }
}