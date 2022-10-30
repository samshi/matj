<?php
include('../include/tools.php');
$file = $_SERVER['QUERY_STRING'];
$local_filename = ROOT . '/matj/src/matj_frontend/assets/'.$file;
//echo $local_filename;
$t = filemtime($local_filename) % 10000;
//echo $t;
redirect('https://hdcafe.com/matj/src/matj_frontend/assets/'.$file.'?'.$t);