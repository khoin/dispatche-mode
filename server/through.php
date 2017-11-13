<?php
	header("Access-Control-Allow-Origin: http://noise.from.uw.seattle.wa.us");

	     $ch = curl_init(); 

        // set url 
        curl_setopt($ch, CURLOPT_URL, "http://www2.seattle.gov/fire/realtime911/getRecsForDatePub.asp?action=Today&incDate=&rad1=des"); 

        //return the transfer as a string 
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1); 

        // $output contains the output string 
        $output = curl_exec($ch); 

        // close curl resource to free up system resources 
        curl_close($ch);      

        echo $output;
?>