<?php

error_reporting(E_ALL);
ini_set('display_errors', TRUE);
ini_set('display_startup_errors', TRUE);

define('EOL',(PHP_SAPI == 'cli') ? PHP_EOL : '<br />');

date_default_timezone_set('Europe/London');

/** Include PHPExcel_IOFactory */
require_once dirname(__FILE__) . '/classes/PHPExcel/IOFactory.php';

$target_dir = "data/";
$target_file = $target_dir . basename($_FILES["excelfile"]["name"]);
$fileType = pathinfo($target_file,PATHINFO_EXTENSION);

if (move_uploaded_file($_FILES["excelfile"]["tmp_name"], $target_file)) 
{
	$objPHPExcel = PHPExcel_IOFactory::load($target_file);
	$objPHPExcel->setActiveSheetIndex(0);
	$data = $objPHPExcel->getActiveSheet()->toArray();

	// the count of columns
	$chars = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
	$cols = 0;
	if(isset($data[0]))
	    $cols = count($data[0]);

    echo json_encode(['result' => true, 'data'=>$data, 'columns'=>$cols]);
}
else
{
	echo json_encode(['result' => false]);
}


