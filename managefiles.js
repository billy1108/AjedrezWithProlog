var ManageFiles = function(){

	this.writeFile = function(msg){
		var fs = require('fs');
		fs.writeFile("entrada.txt", msg, function(err) {
		    if(err) {
		        console.log(err);
		    } else {
		        console.log("The file was saved!");
		    }
		}); 
	}

	this.formatEntrada = function(data){
		return "entrada("+data.type1+","+data.x1+","+data.y1+","+data.type2+","+data.x2+","+data.y2+","+data.type3+","+data.x3+","+data.y3+","+data.turnB+","+data.turnA+","+data.isOn1+","+data.isOn2+","+data.isOn3+","+data.type4+","+data.x4+","+data.y4+","+data.xf4+","+data.yf4+")";
	}

	this.readFile = function(){
		var fs = require('fs');
		var path = require('path');
		var filePath = path.join(__dirname, 'salida.txt');

		fs.readFile(filePath, {encoding: 'utf-8'}, function (err,data) {
			console.log(data);
		  	if (err) {
		    	return console.log(err);
		  	}else{
				console.log(data);
		  	}
		});
	}

	this.getRespond = function(){
		var a = 1;
		var fs = require('fs');
		var path = require('path');
		var filePath = path.join(__dirname, 'salida.txt');

		fs.readFile(filePath, {encoding: 'utf-8'}, function (err,data) {
		  	if (err) {
		    	return console.log(err);
		  	}else{
		  		var mensaje = getDataByPredicate(data);
		  		io.emit('response factorial number', mensaje);
		  	}
		});
	}

	this.getDataByPredicate = function(data){
		return data.split("(")[1].split(")")[0];
	}

	this.executeProgram = function(){
		console.log("ejecutar programa")
		var exec = require('child_process').execFile;
		var fun =function(){
		   exec('g.exe', function(err, data) {
		        console.log(data.toString());                       
		    });
		    exec('kill.bat', function(err, data) {
		        console.log("close");                       
		    });  
		}
		fun();
	}
	
	return this;
}

