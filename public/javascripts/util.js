var COLORS = [
  '#e21400', '#91580f', '#f8a700', '#f78b00',
  '#58dc00', '#287b00', '#a8f07a', '#4ae8c4',
  '#3b88eb', '#3824aa', '#a700ff', '#d300e7'
];

function fillTable(){
	var a = $("#container");
	var abecesario = ["1","2","3","4","5","6","7","8"];
	for (i = 0; i <= 7; i++) {
		$("#container").append("<div class='columna' id='colummna"+i+"'> </div>")
		for (j = 1 ; j <= 8; j++) {
		  	var color = function(){ return (j%2 == 0) ? ((i % 2 == 0) ? "blanco" : "negro") : ((i % 2 == 0) ? "negro" : "blanco"); }();
		  	$("#colummna"+i).append("<div class='cuadrado "+ color + "' id = '"+ abecesario[i] +'-'+ j +"'> </div>")
		};    
	};
}

function cleanSubviewsOfElement(element){
  	$("#"+element.id).html("");
}

function realCoordenadas(string_id){
  	return string_id.split("-")[0]+"-"+(parseInt(string_id.split("-")[1]))
}

// Prevents input from having injected markup
function cleanInput (input) {
	return $('<div/>').text(input).text();
}

// Gets the color of a username through our hash function
function getUsernameColor (username) {
	// Compute hash code
	var hash = 7;
	for (var i = 0; i < username.length; i++) {
		hash = username.charCodeAt(i) + (hash << 5) - hash;
	}
	// Calculate color
	var index = Math.abs(hash % COLORS.length);
	return COLORS[index];
}

function modalwin(){
	console.log("sera ps");
}