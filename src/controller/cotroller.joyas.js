import pool from "../database2/db.js";
import HATEOAS from "../halper/hateoas.js"


import {getJoyasLimitadas,getJoyaMinMax,getJoyasHeteoas} from "../models/models.js"



export const getJoyas = async (req,res) =>{
  try { 
    const result= await getJoyasHeteoas(req);
    const getJoyaswithHeteoas = await HATEOAS('joyas', result)
    res.status(200).json({joya:getJoyaswithHeteoas})
  } catch (error) {
    res.status(500).json({ message: error.message });
  }

}

export const getJoyas1 = async (req,res) =>{
    try { 
      const result= await getJoyasLimitadas(req,res);
      res.status(200).json({joyas:result})
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };


  export const getJoyas2 = async (req,res) =>{
    try { 
      const result= await getJoyaMinMax(req,res);
      res.status(200).json(result)
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
   
    

  
  export const agregarJoyas = async (req, res) => {
    try {
      const { nombre, categoria, metal, precio, stock} = req.body;
      const result = await pool.query(
        'INSERT INTO inventario (nombre, categoria, metal, precio, stock) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [nombre, categoria, metal, precio, stock]
      );
      res.status(201).json(result.rows[0]);
      
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  
  export const modificarJoyas = async (req, res) => {
    try {
      const { id } = req.params;
      const { nombre, categoria, metal, precio, stock } = req.body;
  
      
      const fields = { nombre, categoria, metal, precio, stock };
      const keys = Object.keys(fields).filter(key => fields[key] !== undefined);
  
      if (keys.length === 0) {
        return res.status(400).json({ message: 'No fields provided to update' });
      }
  
      const setClause = keys.map((key, index) => `${key} = $${index + 2}`).join(', ');
      const values = [id, ...keys.map(key => fields[key])];
  
      const query = `UPDATE inventario SET ${setClause} WHERE id = $1 RETURNING *`;
      const result = await pool.query(query, values);
  
      if (result.rows.length === 0) {
        res.status(404).json({ message: 'Post not found' });
      } else {
        res.json(result.rows[0]);
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };



  export const eliminarJoyas =async (req, res) => {
    try {
      const { id } = req.params;
      const result = await pool.query('DELETE FROM inventario WHERE id = $1 RETURNING *', [id]);
      if (result.rows.length === 0) {
        res.status(404).json({ message: 'Post not found' });
      } else {
        res.status(204).send();
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };





  export const notFund = (req,res) => res.status(404).json({ message: 'Route not found' });







