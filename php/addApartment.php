<?php
require('connect.php');



$street = $_POST['street'];
$city = $_POST['city'];
$state = $_POST['state'];

$insertQuery = "INSERT INTO `apartments`( `title`, `street`, `city`, `state`, `user_id`) VALUES ('$street', '$street', '$city', '$state', 2 )";
$insertResult = mysqli_query($conn, $insertQuery);

if(mysqli_affected_rows($conn)>0){
    $responseArray = [
        'success'=>true
    ];
    print(json_encode($responseArray));
}else{
    $responseArray = [
        'success'=>false
    ];
    print(json_encode($responseArray));
}




?>