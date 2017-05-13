<?php

if(isset($_POST['email'])) {
     
    // CHANGE THE TWO LINES BELOW
    $email_to = "paul.millar@gmail.com";
    $email_subject = "Pablo Email Signup";
     
     
    function died($error) {
        // your error code can go here
        echo "We are very sorry, but there were error(s) found with the form you submitted. ";
        echo "These errors appear below.<br /><br />";
        echo $error."<br /><br />";
        echo "Please go back and fix these errors.<br /><br />";
        die();
    }
     
    // validation expected data exists
    if(
        !isset($_POST['email']) ||
        !isset($_POST['email'])) {
        died('We are sorry, but there appears to be a problem with the form you submitted.');      
    }
     
    $email_from = $_POST['email']; // required
    $comments = $_POST['comments']; // required
    $name = $_POST['name']; // required
     
    $error_message = "";
    $email_exp = '/^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/';
  if(!preg_match($email_exp,$email_from)) {
    $error_message .= 'The Email Address you entered does not appear to be valid.<br />';
  }

  if(strlen($error_message) > 0) {
    died($error_message);
  }


    $email_message = "Form details below.\n\n";
     
    function clean_string($string) {
      $bad = array("content-type","bcc:","to:","cc:","href");
      return str_replace($bad,"",$string);
    }
     
    $email_message .= "Email: ".clean_string($email_from)."\n";
    $email_message .= "Comments: ".clean_string($comments)."\n";
    $email_message .= "Name: ".clean_string($email)."\n";

     
     
// create email headers
$headers = 'From: '.$email_from."\r\n".
'Reply-To: '.$email_from."\r\n" .
'X-Mailer: PHP/' . phpversion();



@mail($email_to, $email_subject, $email_message, $headers); 
?>
 
<!-- HTML SECTION IS LIKE THE INDEX.HTML SECTION :: JUST CHANGE WHAT YOU NEED TO CHANGE ! -->


<!doctype html>
<!--[if lt IE 7]> <html class="no-js ie6 oldie" lang="en"> <![endif]-->
<!--[if IE 7]>    <html class="no-js ie7 oldie" lang="en"> <![endif]-->
<!--[if IE 8]>    <html class="no-js ie8 oldie" lang="en"> <![endif]-->
<!--[if IE 9]>    <html class="no-js ie9" lang="en"> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js" lang="en" itemscope itemtype="http://schema.org/Product"> <!--<![endif]-->

<head>
    <meta charset="utf-8">
    <!-- Title and meta tag /-->
		<META HTTP-EQUIV=Refresh CONTENT="3; URL=http://trypablo.com">
    <title>Thanks for your feedback</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1">
    <!-- Stylesheets /-->
		<link rel="stylesheet" href="https://www.w3schools.com/lib/w3.css">  
</head>
<body>
    <div class="w3-row">
	      <div class="w3-center">
	      	<br>
	      	<br>
	        <h2>Thank you.</h2>
	        <h4>We'll email you when we have something to report!</h4>
	      </div> 
	    </div>

	    <div class="w3-row" style="margin-top:35px;">
	    	<div class="w3-center">
		      <a class="w3-button" href="index.html" >Back to the website</a>
		  	</div>   
	    </div>


  <!-- Grab Google CDN's jQuery, fall back to local if offline -->
  <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
  <script>window.jQuery || document.write('<script src="js/libs/jquery-1.9.1.min.js"><\/script>')</script>


  </body>
</html>


<?php
}
die();
?>