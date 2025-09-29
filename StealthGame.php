<?php
session_start();
if (!isset($_SESSION['map'])) {
    $_SESSION['map'] = [
        "WWWWWWWWWW",
        "W..G.....W",
        "W..W..E..W",
        "W........W",
        "W..P.....W",
        "WWWWWWWWWW"
    ];
    $_SESSION['px'] = 3;
    $_SESSION['py'] = 4;
    $_SESSION['ex'] = 6;
    $_SESSION['ey'] = 2;
    $_SESSION['goal'] = [3,1];
    $_SESSION['msg'] = "Sneak to the goal without being seen!";
}
$map = $_SESSION['map'];
$px = $_SESSION['px'];
$py = $_SESSION['py'];
$ex = $_SESSION['ex'];
$ey = $_SESSION['ey'];
$goal = $_SESSION['goal'];
$msg = $_SESSION['msg'];
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $dir = $_POST['dir'];
    $dx = $dy = 0;
    if ($dir=="up") $dy=-1; elseif ($dir=="down") $dy=1; elseif ($dir=="left") $dx=-1; elseif ($dir=="right") $dx=1;
    if ($map[$py+$dy][$px+$dx] == ".") {
        $px += $dx; $py += $dy;
    }
    // Enemy AI: moves towards player if line of sight
    if ($ex == $px || $ey == $py) {
        if ($ex < $px) $ex++; elseif ($ex > $px) $ex--;
        if ($ey < $py) $ey++; elseif ($ey > $py) $ey--;
    }
    $msg = "Sneak to the goal!";
    if ($px == $goal[0] && $py == $goal[1]) $msg = "Escaped! You win!";
    if ($px == $ex && $py == $ey) $msg = "Caught! Game Over.";
    $_SESSION['px'] = $px; $_SESSION['py'] = $py; $_SESSION['ex'] = $ex; $_SESSION['ey'] = $ey; $_SESSION['msg'] = $msg;
}
?>
<!DOCTYPE html>
<html>
<head>
<title>Stealth Game</title>
<style>
body { font-family: Arial; margin: 40px;}
.cell { width:32px; height:32px; display:inline-block; border:1px solid #333;}
</style>
</head>
<body>
<h1>Stealth Game</h1>
<form method="post">
    <button name="dir" value="up">Up</button>
    <button name="dir" value="down">Down</button>
    <button name="dir" value="left">Left</button>
    <button name="dir" value="right">Right</button>
</form>
<div>
<?php
for($y=0;$y<count($map);$y++){
    for($x=0;$x<strlen($map[$y]);$x++){
        $col = "#eee";
        if($map[$y][$x]=="W")$col="#333";
        if($x==$px&&$y==$py)$col="#0af";
        if($x==$ex&&$y==$ey)$col="#e33";
        if($x==$goal[0]&&$y==$goal[1])$col="#ff0";
        echo "<div class='cell' style='background:$col'></div>";
    }
    echo "<br>";
}
?>
</div>
<h3><?= $msg ?></h3>
</body>
</html>