require 'gosu'

class TileBasedRPG < Gosu::Window
  def initialize
    super(480, 320)
    self.caption = "Tile-Based RPG"
    @map = [
      "WWWWWWWWWWWW",
      "W..........W",
      "W....M.....W",
      "W..W....K..W",
      "W..W.......W",
      "W..P.......W",
      "WWWWWWWWWWWW"
    ]
    @tiles = []
    @player = {x:3, y:5, has_key:false}
    @key = [9,3]
    @font = Gosu::Font.new(22)
  end

  def update
    if Gosu.button_down? Gosu::KB_LEFT then try_move(-1,0) end
    if Gosu.button_down? Gosu::KB_RIGHT then try_move(1,0) end
    if Gosu.button_down? Gosu::KB_UP then try_move(0,-1) end
    if Gosu.button_down? Gosu::KB_DOWN then try_move(0,1) end
    if [@player[:x],@player[:y]]==@key && !@player[:has_key]
      @player[:has_key]=true
    end
  end

  def try_move(dx,dy)
    nx,ny=@player[:x]+dx,@player[:y]+dy
    return if @map[ny][nx]=="W"
    @player[:x],@player[:y]=nx,ny
  end

  def draw
    7.times do |y| 12.times do |x|
      col = @map[y][x]=="W" ? Gosu::Color::GRAY : Gosu::Color::GREEN
      Gosu.draw_rect(x*40,y*40,40,40,col)
      if @map[y][x]=="M"
        Gosu.draw_rect(x*40+10,y*40+10,20,20,Gosu::Color::RED)
      end
      if [x,y]==@key && !@player[:has_key]
        Gosu.draw_rect(x*40+12,y*40+12,16,16,Gosu::Color::YELLOW)
      end
    end end
    Gosu.draw_rect(@player[:x]*40+8,@player[:y]*40+8,24,24,Gosu::Color::CYAN)
    if @player[:has_key]
      @font.draw_text("Key obtained! Go to exit!",10,280,0)
    else
      @font.draw_text("Find the key!",10,280,0)
    end
  end
end

TileBasedRPG.new.show