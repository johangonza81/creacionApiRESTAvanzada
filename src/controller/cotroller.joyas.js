import pool from "../database2/db.js";
import pgFormat from 'pg-format';

export const getJoyas = async (req,res) =>{
  
  const{limits = 10, order_by:orderBy ='stock_ASC', page = 0} = req.query;
 
  const [column,sort] = orderBy.split('_')
  const offset =  page > 0 ? (page - 1) * limits : 0;
    
    try { 
      const query = pgFormat('SELECT * FROM inventario ORDER BY %I %s LIMIT %L OFFSET %L',
      column,
      sort.toUpperCase(),
      limits,
      offset
      );

      const result = await pool.query(query);
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };


  export const getJoyas2 = async (req,res) =>{
  
    const{
      limits = 10, 
      order_by:orderBy ='stock_ASC',
      page = 0,
      precio_min:precioMin,
      precio_max:precioMax,
      categoria,
      metal
      } = req.query;
   
    const [column,sort] = orderBy.split('_')
    const offset =  page > 0 ? (page - 1) * limits : 0;


  const conditions = [];

  if (precioMin !== undefined && precioMin !== null && precioMin !=='') {
    conditions.push(pgFormat('precio >= %L', precioMin));
  }

  if (precioMax !== undefined && precioMax !== null && precioMax !=='')  {
    conditions.push(pgFormat('precio <= %L', precioMax));
  }

  if (categoria)  {
    conditions.push(pgFormat('categoria = %L', categoria));
  }

  if (metal)  {
    conditions.push(pgFormat('metal = %L', metal));
  }

  let whereClause = '';
  if(conditions.length > 0) {
  whereClause =`WHERE ${conditions.join(' AND ')}`;
  } 
      
      try { 
        const query = pgFormat('SELECT * FROM inventario %s ORDER BY %I %s LIMIT %L OFFSET %L',
        whereClause,
        column,
        sort.toUpperCase(),
        limits,
        offset
        );
  
        const result = await pool.query(query);
        res.json(result.rows);
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







