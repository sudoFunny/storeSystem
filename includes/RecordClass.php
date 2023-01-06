<?php

/**
 * 
 * About
 * 
 * Treat Class Record as a session.
 * 
 * Add or subtract values over time per "session",
 * session being started when sales start after a long -admin defined-
 * period of time or by a less automatic system.
 * 
 */

class Record {
    public $popcorn = array("amount" => 0);
    public $slushie = array("small" => 0, "large" => 0, "jumbo" => 0);
    public $tea = array("small" => 0, "large" => 0);
    public $lemonade = array("small" => 0, "large" => 0);
    public $coffee = array("small" => 0, "large" => 0, "jumbo" => 0);
    public $dipinDots = array("cottonCandy" => 0, "cookiesAndCream" => 0, "cookieDough" => 0);
    public $cookies = array("chocolate" => 0, "sugar" => 0);
    public $hotChocolate = array("withToppings" => 0, "withoutToppings" => 0);
    
    public $donations = array("amount" => 0);


    //public $priceScheme = array("version" => "unset");




	/**
	 * 
	 * 
	 * Returns file path: string
	 * 
	 * Function:
	 * 		generates csv data and writes to new csv file 
	 */
    public function toCSV () {
        $fields = array_keys(get_object_vars($this));
        $lines = [];

        for ($i = 0; $i < count($fields); $i++) {
            $fieldKeys = array_keys($this->{$fields[$i]});

            for ($o = 0; $o < count($fieldKeys); $o++) {
                array_push($lines, array($fields[$i] . " " . $fieldKeys[$o], $this->{$fields[$i]}[$fieldKeys[$o]]));
            }
        }

        $fileName = "../records/record.csv";
        
        $fp = fopen($fileName, "w");
        foreach ($lines as $line) {
            fputcsv($fp, $line);
        }
        fclose($fp);
        
        return $fileName;
    }
}
?>
