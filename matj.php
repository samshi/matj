<?php
$root = $_SERVER['DOCUMENT_ROOT'];
include_once($root . '/include/tools.php');
$file = $_SERVER['QUERY_STRING'];
$local_filename = $root . '/matj/src/matj_frontend/assets/'.$file;
//echo $local_filename;
$t = filemtime($local_filename) % 10000;
//echo 'https://hdcafe.com/matj/src/matj_frontend/assets/'.$file.'?'.$t;
redirect('https://hdcafe.com/matj/src/matj_frontend/assets/'.$file.'?'.$t);