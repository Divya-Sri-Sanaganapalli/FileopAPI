const fs = require("fs");
const express = require('express');
const app = express();
const port = 4000;
const bodyParser = require('body-parser');
//var data= JSON.parse(data);
//var newData = JSON.stringify(data);
app.use(bodyParser.json());

const { check, validationResult } = require('express-validator');

// US1 - Retrieve all the records from the json file
app.get('/readJsonData', async (req, res) => {
    fs.readFile("./data.json", "utf8", (err, data) => {
        if (err) {
            console.log("File read failed:", err);
            res.status(500).json({
                error: {
                    message: "Error retrieving the data"
                }
            })
        } else if (data == '') {
            res.status(200).json({
                error: {
                    message: "No data to retrieve"
                }
            })
        } else {
            console.log(data)
            return res.status(200).send(data);
        }
    });
})


// The below method will work upto 100 MB. For more we need to use db.

// US 2 - Add a record to the json file
app.post('/Writejsondata', [check('id').isNumeric(), check('name').isLength({min: 3}), check('order_count').isNumeric(), check('address').isLength({min:5})], (req, res) => {
    const id = req.query.id;
    const name = req.query.name;
    const order_count = req.query.order_count;
    const address = req.query.address;
    fs.readFile('./data.json', 'utf8', function readFileCallback(err, data) {
        if (err) {
            console.log("File read failed:", err);
            res.status(500).json({
                error: {
                    message: "Error retrieving the data"
                }
            })
        } else if (data == '') {
            var jsonData = {
                data_obj: []
            };
            jsonData.data_obj.push({
                'id': id,
                'name': name,
                'order_count': order_count,
                'address': address
            });
            console.log(data)
            //var json = JSON.stringify(jsonData);
            fs.writeFile("./data.json", JSON.stringify(jsonData), err => {
                if (err) {
                    res.status(400).json({
                        error : err.message
                    });
                } else {
                    return res.status(200).send("Write successful")
                }
            });
        } else {
            obj = JSON.parse(data)
            var dataArray = obj.data_obj;
            for(i =0 ; i < dataArray.length; i++) {
              if(dataArray[i].id == id) {
                return res.status(400).json({
                  error: {
                    message : "Duplicate ID"
                  } 
                });
              }
            }
            obj.data_obj.push({
                  'id': id,
                  'name': name,
                  'order_count': order_count,
                  'address': address
            });
            fs.writeFile("./data.json", JSON.stringify(obj), err => {
                if (err) {
                      res.status(400).json({
                          'error': err.message
                      });
                } else {
                    res.status(200).send("Write successful")
                  }
            });
        }
  });
});

// US 3 - update an existing record to a json file

app.put('/Updatejsondata', [check('id').isNumeric(), check('name').isLength({min: 3}), check('order_count').isNumeric(), check('address').isLength({min:5})],async (req, res) => {
    const id = req.query.id;
    const name = req.query.name;
    const order_count = req.query.order_count;
    const address = req.query.address;
    if(!id)
        return res.status(400).json({message: "Please enter an id"})

    fs.readFile('./data.json', 'utf8', function readFileCallback(err, data) {
        if (err) {
            console.log("File read failed:", err);
            res.status(500).json({
                error: {
                    message: "Error retrieving the data"
                }
            })
        }
        else{
            obj = JSON.parse(data)
            var dataArray = obj.data_obj;
            for(i =0 ; i < dataArray.length; i++) {
                if(dataArray[i].id == id){
                    dataArray[i].name = name,
                    dataArray[i].order_count = order_count,
                    dataArray[i].address = address

                    fs.writeFile("./data.json", JSON.stringify(obj), err => {
                        if (err) {
                            res.status(400).json({
                                'error': err.message
                            });
                        } else {
                            res.status(200).send("Write successful")
                        }
                    });
                }
            }
            return res.status(400).json({
                error: { 
                            message: "ID not found"
                        }
            });
            
        }
    })
})

// US 4 - Delete a record in json file 
app.delete('/Deletejsondata', async (req, res) => {
    const id = req.query.id;
    if(!id)
        return res.status(400).json({message: "Please enter an id"})
    fs.readFile('./data.json', 'utf8', function readFileCallback(err, data) {
        if (err) {
            console.log("File read failed:", err);
            res.status(500).json({
                error: {
                    message: "Error retrieving the data"
                }
            })
        }
        else{
            obj = JSON.parse(data)
            var dataArray = obj.data_obj;
            for(i =0 ; i < dataArray.length; i++) {
                if(dataArray[i].id == id){
                    const indexOfId = dataArray.indexOf(dataArray[i])
                    if(indexOfId > -1){
                        dataArray.splice(indexOfId, 1)
                    }
                    //console.log(dataArray[i])
                    //delete dataArray[i] 
                    //console.log('deleted',dataArray[i])  // delete will create a NULL so used splice technique
                    //res.status(200).send("Deleted successfully") 

                    fs.writeFile("./data.json", JSON.stringify(obj), err => {
                        if (err) {
                            res.status(400).json({
                                'error': err.message
                            });
                        } else {
                            res.status(200).send("Write successful")
                        }
                    });
                }
            }
            return res.status(400).json({
                error: { 
                     message: "ID not found"
                    }
            });

        }
    })
})

// US 5 - Retrieve user names who age is greater than the input age

app.get('/userByAge',async (req, res) => {
    const inputAge = req.query.age;
    //console.log(typeof(inputAge))
        if(!inputAge){
            return res.status(400).json({message: "Please enter an age"})
        }
    //console.log(parseInt(inputAge))
        parseInputAge = parseInt(inputAge)
        if(isNaN(parseInputAge)){
            res.status(400).json({
                error : { 
                    message: "You are suppose to enter number"
                }
            })
        }
        else{
            fs.readFile("./generated.json", "utf8", (err, data) => {
            if (err) {
                console.log("File read failed:", err);
                    res.status(500).json({
                        error: {
                            message: "Error retrieving the data"
                        }
                     })
            } else {
                obj = JSON.parse(data)
                var dataArray = obj.new_data;
                let result = []
                for(i =0 ; i < dataArray.length; i++) {
                    if(dataArray[i].age > inputAge){
                    //console.log(dataArray[i].name)
                        names = dataArray[i].name
                        result.push(names);
                    }
                }
                if(result.length == 0)
                    res.status(200).json({message:"No person found"})
                
                else{
                    res.status(200).json(result)
                }
            } 
        });
    } 
})


app.get('/usersByDate', async (req, res) => {
    const inputDate = req.query.date;

})

app.listen(port, () => {
    console.log('The server is running on port', port);
});