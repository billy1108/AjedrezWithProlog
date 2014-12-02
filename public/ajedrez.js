//Posiciones de las fichas
var position_torre = "8-1";
var position_alfil = "5-1";
var position_caballo = "2-8";
var position_reina = "6-8";
var mouse_status = "false";
var mouseenter = "false";
var mousemove = "false";
var current_position_element = null;
var mouse_name_active = null;

var torre_name_class = '.torre_cursor';
var alfil_name_class = '.alfil_cursor'
var caballo_name_class = '.caballo_cursor'
var reina_name_class = '.reina_cursor'

function initTable(){
    fillTable();
    setFichasIntoTable();
    $('.cuadrado').click(function(){
        if (mouse_status === "true"){
            if (isNoColitionWithFriend(this.id)){
                changePosition(this);
                // consult prolog this postion and validate
                $(mouse_name_active).hide();
                $('#container').removeClass();
                desactiveSomeValues();
            }
        }else{
            cleanSubviewsOfElement(this);
            whichMouse(this);
        }
    });
}

function whichMouse(cuadrado){
    current_position_element = cuadrado;
    switch(cuadrado.id){
        case position_torre: changeMouseOver(torre_name_class); break;
        case position_alfil: changeMouseOver(alfil_name_class); break;
        case position_caballo: changeMouseOver(caballo_name_class); break;
        case position_reina: changeMouseOver(reina_name_class); break;
    }
}

function changeMouseOver(name_class){
    var handler = null;
    $('#container').addClass("hidden_mouse");
    $('#container').mouseenter(function(e){
        $('#container').off('mouseenter', handler);
        if (mouseenter == "false"){
            return false;
        }else{
            $(name_class).show();
        }   
    });
    $('#container').mousemove(function(e){
        if (mousemove == "false"){
            $('#container').off('mousemove', handler);
            return false;
        }else{
            $(name_class).css('left', e.clientX -20).css('top', e.clientY + 10 );
        }   
    });
    mouse_name_active = name_class;
    activeSomeValues();
}

var torre_div_str ="<div id='torre' class='ficha' >  <img class='img-ficha' src='images/torre-negra.png'> </div>";
var alfil_div_str = "<div id='alfil' class='ficha' >  <img class='img-ficha' src='images/alfil-negro.png'></div>";
var caballo_div_str = "<div id='caballo' class='ficha' >   <img class='img-ficha' src='images/caballo-blanco.png'></div>";
var reina_div_str = "<div id='reina' class='ficha' >   <img class='img-ficha' src='images/reina-blanca.png'></div>";

function setFichasIntoTable(){
    $("#8-1").append(torre_div_str);
    $("#5-1").append(alfil_div_str);
    $("#2-8").append(caballo_div_str);
    $("#6-8").append(reina_div_str);
}

function changePosition(element){
  switch (mouse_name_active){
    case torre_name_class:
        position_torre = realCoordenadas(element.id);
        $("#"+realCoordenadas(element.id)).append(torre_div_str);
        break;
    case alfil_name_class:
        position_alfil = realCoordenadas(element.id);
        $("#"+realCoordenadas(element.id)).append(alfil_div_str);
        break;
    case caballo_name_class:
        position_caballo = realCoordenadas(element.id);
        $("#"+realCoordenadas(element.id)).append(caballo_div_str);
        break;
    case reina_name_class:
        position_reina = realCoordenadas(element.id);
        $("#"+realCoordenadas(element.id)).append(reina_div_str);
        break;
  }
}

function isNoColitionWithFriend(current_postion){
    switch (mouse_name_active){
        case torre_name_class: return realCoordenadas(current_postion) != position_alfil;
        case alfil_name_class: return realCoordenadas(current_postion) != position_torre;
        case caballo_name_class: return realCoordenadas(current_postion) != position_reina;
        case reina_name_class: return realCoordenadas(current_postion) != position_caballo;
    }
}

function activeSomeValues(){
    mouse_status = "true";
    mouseenter = "true";
    mousemove = "true";
}

function desactiveSomeValues(){
    mouseenter = "false";
    mousemove = "false";
    mouse_status = "false";
}

function resetLastTurn(){ // when fail the turn
    changePosition(current_position_element)
}

function moveElementToCoordinates(){// when emit a message from server should move the piece

}