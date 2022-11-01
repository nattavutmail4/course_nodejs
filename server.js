const express = require('express');
const app = express();
const mysql = require('mysql');
const _ = require('loadsh');
const cors = require('cors')


app.use(cors({
    origin:['http://127.0.0.1:5500','http://localhost:5500'],
    methods:['GET','POST','DELETE','PATCH','PUT'],
    allowedHeaders:['Content-Type']
}));

const db = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"movie",
    charset:'utf8',
})

db.connect((error)=>{
    if(error) {
        console.log(error.stack);
    }
});

app.use(express.urlencoded({extended:true,limit:'50MB'}));
app.use(express.json());
// app.use(cors(corsOptions));



app.get('/api/movie',(request,response)=>{
    try {
        db.query('SELECT *FROM movie',(error,results,fields)=>{
            if(!error){
                return response.status(200).json({
                    ResponseCode:200,
                    ResponseResult:results
                });
            }else{
                return response.status(401).json({
                    ResponseCode:401,
                    ResponseError:error.message,
                    Log:2

                });
            }
        })
    } catch (error) {
        return response.status(500).json({
            ResponseCode:500,
            ResponseMessage:error.message,
            Log:3
        });
    }
});

app.get('/api/moviebyid',(request,response)=>{
    const id = _.get(request,['body','id']);
    try {
        if(id){
            db.query('SELECT * FROM movie where id = '+ id,(error, results, fields)=>{
                if(!error){
                    return response.status(200).json({
                        ResponseCode:200,
                        ResponseResult:results
                    });
                }else{
                    return response.status(401).json({
                        ResponseCode:401,
                        ResponseMessage:error,
                        Log:2
                    })
                }
            });
        }else{
            return response.status(401).json({
                ResponseCode:401,
                ResponseMessage:"invalid data not found",
                Log:3
            })
        }
    } catch (error) {
        return response.status(500).json({
            ResponseCode:500,
            ResponseMessage:error.message,
            Log:4
        })
    }
})

app.post('/api/movie',(request,response)=>{
     const  name  = _.get(request,['body','name']);
     const  description = _.get(request,['body','description']);
     try {
        if(name && description){
             db.query("INSERT INTO movie SET ? ",{name:name,description:description},(error,results,fields)=>{
                 if(!error){
                     return response.status(201).json({
                         ResponseCode:201,
                         ResponseData:'create movie success fuly',
                         Log:201
                     });
                 }else{
                     return response.status(401).json({
                         ResponseCode:401,
                         ResponseError:error.message,
                         Log:1
                     });
                 }
             })
        }else{
            return response.status(401).json({
                ResponseCode:401,
                ResponseMessage:'invalid data',
                Log:2
            });
        }     
     } catch (error) {
        console.log('ERROR LOG 1' , error.message);
        return response.status(500).json({
            ResponseCode:500,
            ResponseMessage:error.message,
            Log:3
        });
     }
});

app.patch('/api/movie',(request,response)=>{
    const id    = _.get(request,['body',['id']]);
    const name  = _.get(request,['body'],['name']);
    const description = _.get(request,['body'],['description']);
    try {
        if(id&name&description){
            db.query('UPDATE movie SET name = ? , description = ? WHERE id = ?',[name,description,id],(error,results,fields)=>{
                if(!error){
                    return response.status(200).json({
                        ResponseCode:201,ResponseMessage:"Update movie succes"
                    });
                }else{
                     return response.status(401).json({
                        ResponseCode:404,ResponseMessage:error.message,Log:2
                     });
                }
            });
        }else{
            return response.status(404).json({
                ResponseCode:404,
                ResponseMessage:'invalid data not found',
                Log:3
            });
        }
    } catch (error) {
        return response.status(500).json({
            ResponseCode:500,ResponseMessage:error.message,Log:4
        });       
    }
});

app.delete('/api/movie',(request,response)=>{
    const id = request.body.id
    try {
        if(id){
            db.query('DELETE FROM movie   WHERE id = ?',[id],(error,results,fields)=>{
                if(!error){
                    return response.status(200).json({
                        ResponseCode:201,
                        ResponseMessage:"Delete movie success"
                    });
                }else{
                     return response.status(401).json({
                        ResponseCode:404,
                        ResponseMessage:error.message,
                        Log:2
                     });
                }
            });
        }else{
            return response.status(404).json({
                ResponseCode:404,
                ResponseMessage:'invalid data not found',
                Log:3
            });
        }
    } catch (error) {
        return response.status(500).json({
            ResponseCode:500,ResponseMessage:error.message,Log:4
        });       
    }
})
const server = app.listen(3030,()=>{
    console.log(`Run server success on http://localhost:3030 `);
});

module.exports = app