const parse = require("csv-parser"); // Importando dependência csv-parser
const fs = require("fs"); // Importando File System para manipulação de arquivos
const csvData = []; // Criando um array vazio para colocar os dados do csv
let newCsvData = []; // Criando um novo objeto para adicionar os dados validados
var objectData = { // Criando objeto para formatar os dados
    fullname: "",
    eid: "",
    groups: [],
    addresses: [],
    invisible: false,
    see_all: false
};
var addressData = { // Criando objeto para formatar os dados de address
    type: "",
    tags: [],
    address: ""
}

// Criando variável para contar a quantidade de linhas no csv
file = fs.readFileSync("input.csv", "utf-8");
const lines = file.split(/\r?\n/).length;

// Lendo os dados do arquivo csv
fs.createReadStream(__dirname + "/input.csv")
    .pipe(
        parse({
            delimiter: "," //Definindo o delimitador
        })
    )
    // Colocando os dados enfileirados do input.csv, no array csvData 
    .on("data", function (dataRow) {
        csvData.push(dataRow);
    })
    .on("end", function () {
        email(); // **em desenvolvimento**
        objeto(csvData, newCsvData);
    });

// Função para separar os campos de email **em desenvolvimento**
function email() {
    let header = file.split(/\r?\n/)
    let email = header[0].split(",");

    for (var l = 0; l < email.length; l++) {
        if (email[l].includes("email") == true) {
            console.log(email[l]);
        }
    }
}

// Adicionando dados validados no objeto e, posteriormente, no novo array
function objeto(csvData, newCsvData) {
    for (var i = 0; i < lines - 1; i++) {
        let j = i - 1;
        let obj = Object.create(objectData);

        if (i == 0) { // Adicionando primeira entrada
            objectData.fullname = (csvData[i]["fullname"]);
            objectData.eid = csvData[i]["eid"];
            objectData.groups = csvData[i]["group"].split("," || "/");

            if (csvData[i]["invisible"] == 1 || csvData[i]["invisible"] == "yes") {
                objectData.invisible = true;
            } else {
                objectData.invisible = false;
            }
            if (csvData[i]["see_all"] == 1 || csvData[i]["see_all"] == "yes") {
                objectData.see_all = true;
            } else {
                objectData.see_all = false;
            }

        } else {
            if (csvData[i]["eid"] == csvData[i - 1]["eid"]) {
                objectData.fullname = (csvData[j]["fullname"]);
                objectData.eid = csvData[j]["eid"];

                if (csvData[j]["invisible"] == 1 || csvData[j]["invisible"] == "yes") {
                    objectData.invisible = true;
                } else {
                    objectData.invisible = false;
                }
                if (csvData[j]["see_all"] == 1 || csvData[j]["see_all"] == "yes") {
                    objectData.see_all = true;
                } else {
                    objectData.see_all = false;
                }

                let arrayGroup = csvData[i]["group"]
                objectData.groups.push(arrayGroup);
                newCsvData.push(objectData);

            } else {
                obj.fullname = (csvData[i]["fullname"]);
                obj.eid = csvData[i]["eid"];
                obj.groups = csvData[i]["group"].split("," || "/");

                if (csvData[i]["invisible"] == 1 || csvData[i]["invisible"] == "yes") {
                    obj.invisible = true;
                } else {
                    obj.invisible = false;
                }
                if (csvData[i]["see_all"] == 1 || csvData[i]["see_all"] == "yes") {
                    obj.see_all = true;
                } else {
                    obj.see_all = false;
                }

                newCsvData.push(obj);
            }
        }
    }
    arrayToJson(newCsvData);
}

// Converte o array newCsvData em Json
function arrayToJson(newCsvData) {
    const Json = JSON.stringify(newCsvData);
    printOutputJson(Json);
};

// Imprime o Json no arquivo output.json
function printOutputJson(Json) {
    fs.writeFile("output.json", Json, (err) => {
        if (err) {
            console.log(err);
        }
        else {
            fs.readFileSync("output.json", "utf8")
        }
    }
    )
};