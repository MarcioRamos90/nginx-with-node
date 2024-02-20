const express = require('express')
const app = express()
const port = 3000
const config = {
    host: 'db',
    user: 'root',
    password: '123456',
    database:'nodedb'
};
const mysql = require('mysql')

const { uniqueNamesGenerator, names, starWarsCharacters } = require('unique-names-generator');

const pool = mysql.createPool({
    poolLimit: 10,    
    ...config
}); 

const sql_create_db = `CREATE DATABASE IF NOT EXISTS nodedb`
pool.query(sql_create_db)
const sql_createtable = `CREATE TABLE IF NOT EXISTS people(id integer not null auto_increment, name varchar(255), PRIMARY KEY(id))`
pool.query(sql_createtable)

CreateElement = () =>{
    const config_name = {
        dictionaries: [names, names],
        separator: " "
    }
    const characterName = uniqueNamesGenerator(config_name);

    return new Promise((resolve, reject)=> {
        pool.query(`INSERT INTO people(name) values('${characterName}');`,  (error, elements)=>{
            if(error){
                return reject(error);
            }
            return resolve(elements);
        });
    });
};

SelectAllElements = () =>{
    return new Promise((resolve, reject)=> {
        pool.query('SELECT * FROM people;',  (error, elements)=>{
            if(error){
                return reject(error);
            }
            return resolve(elements);
        });
    });
};

app.get('/', async (req, res) => {
    try {
        
        await CreateElement()
        
        const names = await SelectAllElements()

        let content = ""

        for (const name of names) {
            content += `
                <p> - id: ${name.id}, name: ${name.name}</p>
            `
        }

        const body = `
        <html>
            <style>
                body { text-align: center; }
                .content { 
                    width: 250px;
                    margin: auto;
                    text-align: left;
                }
            </style>
            <body>
                <h1>Full Cycle Rocks!</h1>
                <div class="content">
                    ${content}
                </div>
            </body>
        </html>
        `
        res.send(body)
    } catch (error) {
        console.log(error);
    }
})

app.listen(port, ()=> {
    console.log('Rodando na porta ' + port)
})