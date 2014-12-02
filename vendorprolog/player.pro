domains
	i = integer
	s = symbol
database-entradadb
	entrada(s,i,i,s,i,i,s,i,i,s,s,s,s,s,s,i,i,i,i)
database-salidadb
	salida(s)
database-estadogamedb
	estadojuego(s)
database-cambiarestadomuertedb
	muerte(i,i,s)
predicates
	nondeterm lee
	nondeterm caballo(i,i,i,i)
	nondeterm torre(i,i,i,i)
	nondeterm alfil(i,i,i,i)
	nondeterm reina(i,i,i,i)
	nondeterm convertir(i,i)
	nondeterm pieza(s,i,i,i,i)
	nondeterm validaganador(i,i,i,i,s,s,s,s,s,s,i,i,i,i,s,s)
	nondeterm cordenadasiguales(i,i,i,i)
	nondeterm cambiarestadomuerto(i,i,s)
	nondeterm validaestadopieza(s,s)
clauses
	lee:- entrada(_,_,_,_,X1B,Y1B,_,X1C,Y1C,TA,TB,STA,STB,STC,PIEZA,FX,FY,FX1,FY2),
	      write("validapieza "),nl,
	      pieza(PIEZA,FX,FY,FX1,FY2),
	      write("validaganador "),nl,
              validaganador(X1B,Y1B,X1C,Y1C,TA,TB,STA,STB,STC,PIEZA,FX,FY,FX1,FY2,L1,L2),
              write("validaestadopieza "),nl,
              validaestadopieza(L1,L2),
              write("gravar A GANADOR "),nl,
              assertz(estadojuego("GANO A"),estadogamedb),
              save("estadojuego.txt",estadogamedb);
              
              entrada(_,_,_,_,X1B,Y1B,_,X1C,Y1C,TA,TB,STA,STB,STC,PIEZA,FX,FY,FX1,FY2),
              pieza(PIEZA,FX,FY,FX1,FY2),
              validaganador(X1B,Y1B,X1C,Y1C,TA,TB,STA,STB,STC,PIEZA,FX,FY,FX1,FY2,_,_),
              assertz(salida("true"),salidadb),
              write("CASON 2 come a uno pero todabia no gana "),nl,
	      save("salida.txt",salidadb);
	      
	      entrada(_,_,_,_,_,_,_,_,_,_,_,_,_,_,PIEZA,FX,FY,FX1,FY2),
              pieza(PIEZA,FX,FY,FX1,FY2),
              write("posicion valida SON PASIVOS CASO 3 "),nl,
              assertz(salida("true"),salidadb),
	      save("salida.txt",salidadb);
	      assertz(salida("false"),salidadb),
	      write("posicion invalida  CASO 4 "),nl,
	      save("salida.txt",salidadb).
	      
	
	validaestadopieza(STB,STC):- write("WTFFFF "),nl,
				STB = "muerto", STC = "muerto".
	 
	 validaganador(X1B,Y1B,X1C,Y1C,TA,TB,STA,STB,STC,PIEZA,FX,FY,FX1,FY2,L1,L2):- STB ="vivo",write("estado muerto1"),nl,cordenadasiguales(FX1,FY2,X1B,Y1B),cambiarestadomuerto(X1B,Y1B,TB),L1 = "muerto",L2 = STC;
	 									      STC ="vivo",write("estado muerto2"),nl,cordenadasiguales(FX1,FY2,X1C,Y1C),cambiarestadomuerto(X1C,Y1C,TB),L1 = STB,L2 = "muerto".
	 	
	 cordenadasiguales(X1,Y1,X2,Y2):-write("X1 = "), write(X1),nl,
	 				write("Y1 = "),write(Y1),nl,
	 				write("X2 = "),write(X2),nl,
	 				write("Y2 = "),write(Y2),nl,
	 				X1 = X2,
	 				  Y1 = Y2.
	 
	 cambiarestadomuerto(X,Y,S):- 
	 			   assertz(muerte(X,Y,S),cambiarestadomuertedb),
	      			   save("muerte.txt",cambiarestadomuertedb).
	 	 
	 pieza(TYPE,X1,Y1,X2,Y2):-
	 			TYPE = "caballo",caballo(X1,Y1,X2,Y2);
	 			TYPE = "reina",reina(X1,Y1,X2,Y2);
	 			TYPE = "alfil",alfil(X1,Y1,X2,Y2);
	 			TYPE = "torre",torre(X1,Y1,X2,Y2).
	 
	convertir(N,F):- N < 0,
		       F = N * (-1);
		       F = N. 
	
	caballo(X1,Y1,X2,Y2):- 
		X1 + 1 = X2,  Y1 + 2 = Y2; 
		X1 + 1 = X2,  Y1 - 2 = Y2;
		X1 - 1 = X2,  Y1 + 2 = Y2;
		X1 - 1 = X2, Y1 - 2 = Y2;
		X1 + 2 = X2, Y1 + 1 = Y2;
		X1 + 2 = X2, Y1 - 1 = Y2;
		X1 - 2 = X2, Y1 + 1 = Y2;
		X1 - 2 = X2, Y1 - 1 = Y2. 
		
	torre(X1,Y1,X2,Y2):- X1 = X2;
			     Y1 = Y2.

	alfil(X1,Y1,X2,Y2):- 
			A = X2 - X1,
			convertir(A,F1),
			B = Y1 -Y2,
			convertir(B,F2),
			F1 = F2.
			
	reina(X1,Y1,X2,Y2):- 
			torre(X1,Y1,X2,Y2);   
 			alfil(X1,Y1,X2,Y2).
goal
	consult("entrada.txt",entradadb),
	lee.
