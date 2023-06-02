<?php

include 'bd/BD.php';

header('Access-Control-Allow-Origin: *');

if($_SERVER['REQUEST_METHOD']=='GET'){
    if(isset($_GET['id'])){
        $query="select * from prlj where id=".$_GET['id'];
        $resultado=metodoGet($query);
        echo json_encode($resultado->fetch(PDO::FETCH_ASSOC));
    }else{
        $query="select * from prlj";
        $resultado=metodoGet($query);
        echo json_encode($resultado->fetchAll()); 
    }
    header("HTTP/1.1 200 OK");
    exit();
}

if($_POST['METHOD']=='POST'){
    unset($_POST['METHOD']);
    $nombre=$_POST['nombre'];
    $apellido=$_POST['apellido'];
    $materia=$_POST['materia'];
    $codigo=$_POST['codigo'];
    $facultad=$_POST['facultad'];
    $semestre=$_POST['semestre'];
    $query="INSERT INTO prlj(nombre, apellido, materia, codigo, facultad, semestre) VALUES ('$nombre', '$apellido', '$materia', '$codigo', '$facultad', '$semestre')";
    $queryAutoIncrement="select MAX(id) as id from prlj";
    $resultado=metodoPost($query, $queryAutoIncrement);
    echo json_encode($resultado);
    header("HTTP/1.1 200 OK");
    exit();
}

if($_POST['METHOD']=='PUT'){
    unset($_POST['METHOD']);
    $id=$_GET['id'];
    $nombre=$_POST['nombre'];
    $apellido=$_POST['apellido'];
    $materia=$_POST['materia'];
    $codigo=$_POST['codigo'];
    $facultad=$_POST['facultad'];
    $semestre=$_POST['semestre'];
    $query="UPDATE prlj SET nombre='$nombre', apellido='$apellido', materia='$materia', codigo='$codigo', facultad='$facultad', semestre='$semestre' WHERE id='$id'";
    $resultado=metodoPut($query);
    echo json_encode($resultado);
    header("HTTP/1.1 200 OK");
    exit();
}

if($_POST['METHOD']=='DELETE'){
    unset($_POST['METHOD']);
    $id=$_GET['id'];
    $query="DELETE FROM prlj WHERE id='$id'";
    $resultado=metodoDelete($query);
    echo json_encode($resultado);
    header("HTTP/1.1 200 OK");
    exit();
}

header("HTTP/1.1 400 Bad Request");
?>