const express = require('express'); //referencia del framework, agregar el modulo de express
const app = express(); // crear instancia 
const Joi = require('@hapi/joi'); //agregar modulo joi, usamos joi para data validation

app.use(express.json());// para reconocer los requests como jasons, built in method dentro de express

const recetas = [

{name: 'Arroz con Pollo', id: 1, pasos: ['picar cebolla','cortar tomate'], ingredientes: [{nombre:'cebolla', cantidad:500},{nombre:'tomate', cantidad:1000}]},

{name: 'Brownie', id: 2, pasos: ['cortar chocolate','derretir manteca'], ingredientes: [{nombre:'manteca', cantidad:500},{nombre:'chocolate', cantidad:1000}]},

{name: 'Ñoquis de Batata', id: 3, pasos: ['pelar batata','agregar harina'], ingredientes: [{nombre:'batata', cantidad:500},{nombre:'harina', cantidad:2000}]},

]



//READ
app.get('/', (req,res) =>{

	res.send('holis'); //respuesta

}) //llamamos al metodo GET para la variable APP que creamos arriba. Especificamos la ruta. 
//req es el request object, contiene la info del HTTP request. El objeto res es la respuesta http que manda express cuando tiene un http request


app.get('/api/recetas', (req,res)=>{ //array

	res.send(recetas); //respuesta al request de la linea 26

})

app.get('/api/recetas/:id', (req,res) =>{ //para buscar una receta individual dentro de mi array de recetas

	const receta = recetas.find(c => c.id === parseInt(req.params.id)); //find es un metodo que devuelve el valor del primer elemento del array que matchee
	if(!receta)res.status(404).send('receta no encontrada'); //si el id no corresponde a un elemento dentro del array, tira error 
	res.send(receta);  //devolver la receta que matchea con el id ingresado

})





//CREATE
app.post('/api/recetas', (req,res)=> { //ruta

	const {error} = validarReceta(req.body); //la data que queremos validar
	if (error){ //si hay error en la validacion, mostramos status
		res.status(400).send(error.details[0].message) //pero mostrame solo el primer error que aparece
		return;
	}

	const receta = { //si no hay error en la validacion, podemos agregar el item
		id: recetas.length + 1,
		name: req.body.name
	};

	recetas.push(receta);
	res.send(receta);
});



function validarReceta(receta){//joi usa esquemas para definir las reglas de validacion de la data

	const esquema = Joi.object({ name: Joi.string().min(3).required() });
	const validacion = esquema.validate(receta);
	return validacion; 

}


const port = process.env.PORT || 5001; //process.env es una variable global injectada por node, aca seteamos el puerto
app.listen(port, ()=> console.log(`en puerto ${port}...`));//cuando corre la app en la consola muestra este mensaje 

//agrego nodemon para que restartee el server automaticamente con los cambios, y no tener que hacerlo manualmente
