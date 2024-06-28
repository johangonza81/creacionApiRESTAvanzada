import pgFormat from 'pg-format';
import pool from '../database2/db.js';



export const getJoyasHeteoas = async (req,res) =>{
    const result = await pool.query('SELECT * FROM inventario;') 
    return result.rows
}




export const getJoyasLimitadas = async (req) =>{
    const{limits = 10, order_by:orderBy ='stock_ASC', page = 0} = req.query;
    const [column,sort] = orderBy.split('_')
    const offset =  page > 0 ? (page - 1) * limits : 0;
    const query = pgFormat('SELECT * FROM inventario ORDER BY %I %s LIMIT %L OFFSET %L',
        column,
        sort.toUpperCase(),
        limits,
        offset
        );
    const result = await pool.query(query);
    return result.rows
}




export const getJoyaMinMax = async (req,res) =>{
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
        
        
          const query = pgFormat('SELECT * FROM inventario %s ORDER BY %I %s LIMIT %L OFFSET %L',
          whereClause,
          column,
          sort.toUpperCase(),
          limits,
          offset
          );
    
          const result = await pool.query(query);
          res.json(result.rows);   
        }


        