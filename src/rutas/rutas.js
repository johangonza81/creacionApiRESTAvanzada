import express from "express";
import { joyasLog } from "../middleware/joyas.middleware.js";
import * as controller  from '../controller/cotroller.joyas.js';



const router = express.Router();

  // Obtener todos las joyas
 router.get('/joyas', joyasLog,controller.getJoyas) 

  // Obtener todos las joyas
  router.get('/joyas/limits', joyasLog,controller.getJoyas1)

  // Obtener todos las joyas filtradas
  router.get('/joyas/filtros', joyasLog,controller.getJoyas2)
  
  // Crear una nueva joya
  router.post('/joyas/agregar', joyasLog,controller.agregarJoyas)
 
  
  // Modificar una joya
  router.put('/joyas/:id',joyasLog,controller.modificarJoyas)
  
  
  // Eliminar una joya
  router.delete('/joyas/:id', joyasLog,controller.eliminarJoyas)


  // Cualquier otra Ruta
  router.all('*',controller.notFund)
  
 export default router;