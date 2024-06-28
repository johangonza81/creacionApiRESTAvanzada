const HATEOAS =async (entity, data) =>{
    const result = data.map((item) => {
        return {
            nombre: item.nombre,
            links:[
                { href: `http://localhost:3000/joyas/${item.id}` }
            ]
        }
    })
    .slice(0,2)

    const total= data.length
    const dataHateoas = {
        total,
        result
    }
    return dataHateoas
}
export default HATEOAS;