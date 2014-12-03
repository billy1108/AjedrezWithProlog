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

var torre_status = "vivo";
var alfil_status = "vivo";
var reina_status = "vivo";
var caballo_status = "vivo";

function initTable(){
    fillTable();
    setFichasIntoTable();
    $('.cuadrado').click(function(){
        if (mouse_status === "true"){
            if (isNoColitionWithFriend(this.id)){
                
                var data = getObjectToSend(this.id)
                socket.emit('play game', data);
                // consult prolog this postion and validate
                // changePosition(this);
                $(mouse_name_active).hide();
                // $('#container').removeClass();
                // desactiveSomeValues();
            }
        }else{
            cleanSubviewsOfElement(this);
            whichMouse(this);
        }
    });
}

function getObjectToSend(cuadrado_id){
    var data;
    switch (mouse_name_active){
    case torre_name_class:
        data = { "type4" : "torre", "x4" : getPositionX(position_torre), "y4" : getPositionY(position_torre), "xf4" : getPositionX(cuadrado_id), "yf4" : getPositionY(cuadrado_id),
                     "type1" : "alfil" , "x1" : getPositionX(position_alfil),  "y1" : getPositionY(position_alfil),
                     "type2" : "reina", "x2" : getPositionX(position_reina), "y2" : getPositionY(position_reina),
                     "type3" : "caballo", "x3" : getPositionX(position_caballo), "y3" : getPositionY(position_caballo),
                     "turnB" : "B", "turnA" : "A", //TODO Implement turn
                     "isOn1" : alfil_status, "isOn2" : reina_status, "isOn3" : caballo_status }; //TODO Implement status
        break;
    case alfil_name_class:
        data = { "type4" : "alfil", "x4" : getPositionX(position_alfil), "y4" : getPositionY(position_alfil), "xf4" : getPositionX(cuadrado_id), "yf4" : getPositionY(cuadrado_id),
                     "type1" : "torre" , "x1" : getPositionX(position_torre),  "y1" : getPositionY(position_torre),
                     "type2" : "reina", "x2" : getPositionX(position_reina), "y2" : getPositionY(position_reina),
                     "type3" : "caballo", "x3" : getPositionX(position_caballo), "y3" : getPositionY(position_caballo),
                     "turnB" : "B", "turnA" : "A", //TODO Implement turn
                     "isOn1" : torre_status, "isOn2" : reina_status, "isOn3" : caballo_status }; //TODO Implement status
        break;
    case caballo_name_class:
        data = { "type4" : "caballo", "x4" : getPositionX(position_caballo), "y4" : getPositionY(position_caballo), "xf4" : getPositionX(cuadrado_id), "yf4" : getPositionY(cuadrado_id),
                     "type1" : "reina" , "x1" : getPositionX(position_reina),  "y1" : getPositionY(position_reina),
                     "type2" : "alfil", "x2" : getPositionX(position_alfil), "y2" : getPositionY(position_alfil),
                     "type3" : "torre", "x3" : getPositionX(position_torre), "y3" : getPositionY(position_torre),
                     "turnB" : "B", "turnA" : "A", //TODO Implement turn
                     "isOn1" : reina_status, "isOn2" : alfil_status, "isOn3" : torre_status }; //TODO Implement status
        break;
    case reina_name_class:
        data = { "type4" : "reina", "x4" : getPositionX(position_reina), "y4" : getPositionY(position_reina), "xf4" : getPositionX(cuadrado_id), "yf4" : getPositionY(cuadrado_id),
                     "type1" : "caballo" , "x1" : getPositionX(position_caballo),  "y1" : getPositionY(position_caballo),
                     "type2" : "alfil", "x2" : getPositionX(position_alfil), "y2" : getPositionY(position_alfil),
                     "type3" : "torre", "x3" : getPositionX(position_torre), "y3" : getPositionY(position_torre),
                     "turnB" : "B", "turnA" : "A", //TODO Implement turn
                     "isOn1" : caballo_status, "isOn2" : alfil_status, "isOn3" : torre_status }; //TODO Implement status
        break;
    }
    data.player = "player";
    return data;
}

function getPositionX(convert){
    return parseInt(convert.split("-")[0])
}

function getPositionY(convert){
    return parseInt(convert.split("-")[1])
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
    console.log("changePosition"+element.id);
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

function moveElementToCoordinates(data){// when emit a message from server should move the piece
    var element = { id: data.x + "-" + data.y }
    changePosition(element)
    $('#container').removeClass();
    desactiveSomeValues();
}

function deleteElementInTable(data){
    var element_id = data.x + "-" + data.y
    var element = $("#"+realCoordenadas(element_id))
    switch (data){
        case "reina":
            cleanSubviewsOfElement($("#"+position_torre));
            reina_status = "muerto";
            break;
        case "caballo":
            cleanSubviewsOfElement($("#"+position_alfil));
            caballo_status = "muerto";
            break;
        case "alfil":
            cleanSubviewsOfElement($("#"+position_caballo));
            alfil_status = "muerto";
            break;
        case "torre":
            cleanSubviewsOfElement($("#"+position_reina));
            torre_status = "muerto";
            break;
    }
}