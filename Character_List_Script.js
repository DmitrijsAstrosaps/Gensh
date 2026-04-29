let Characters = [];

async function loadCharacters() {
    const response = await fetch('Character_List.csv');
    const data = await response.text();
    const lines = data.trim().split('\n');
    Characters = lines.map(line => {
        const cols = line.replace('\r', '').split(';');
        return [
            cols[0],
            cols[1],
            cols[2],
            cols[3],
            cols[4],
            cols[5],
            parseFloat(cols[6])
        ];
    });
}

window.onload = loadCharacters;

let dataNames = [
    ["4", "5"], 
    ["Anemo", "Geo", "Electro", "Dendro", "Hydro", "Pyro", "Cryo"], 
    ["Sword", "Claymore", "Polearm", "Bow", "Catalyst"], 
    ["Mondstadt", "Liyue", "Inazuma", "Sumeru", "Fontaine", "Natlan", "Nod-Krai", "Snezhnaya", "Outlander"]
];

let dataButtons = [
    [0, 0],                     // 4 star, 5 star
    [0, 0, 0, 0, 0, 0, 0],      // Anemo, Geo, Electro, Dendro, Hydro, Pyro, Cryo
    [0, 0, 0, 0, 0],            // Sword, Claymore, Polearm, Bow, Catalyst
    [0, 0, 0, 0, 0, 0, 0, 0, 0] // Mondstadt, Liyue, Inazuma, Sumeru, Fontaine, Natlan, Nod-Krai, Snezhnaya, Outlander
];

document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("up").addEventListener("input", PrintTable);
    document.getElementById("down").addEventListener("input", PrintTable);
    document.getElementById("equale").addEventListener("input", PrintTable);
    document.getElementById("up").value = "";
    document.getElementById("down").value = "";
    document.getElementById("equale").value = "";
});

function test_function(thing, id, btn){
    thing[id] += 1;
    if (thing[id] == 3) thing[id] = 0;
    
    switch(thing[id]){
        case 0:
            btn.style.backgroundColor = null;
            break;
        case 1:
            btn.style.backgroundColor = "rgb(48, 193, 48)";
            break;
        case 2:
            btn.style.backgroundColor = "rgb(255, 60, 60)";
            break;
    }
    PrintTable();
}

function diference(i){
    var upVersion = parseFloat(document.getElementById("up").value);
    var downVersion = parseFloat(document.getElementById("down").value);
    var equaleVersion = parseFloat(document.getElementById("equale").value);

    if(!isNaN(upVersion) && !isNaN(downVersion) ){
        return Characters[i][6] > upVersion && Characters[i][6] < downVersion;
    }
    if(!isNaN(upVersion)){
        return Characters[i][6] > upVersion;
    }
    if(!isNaN(equaleVersion)){
        return Characters[i][6] == equaleVersion;
    }
    if(!isNaN(downVersion)){
        return Characters[i][6] < downVersion;
    }
}

function PrintTable() {
    var table = document.getElementById("Trysss");
    while (table.rows.length > 1) {
        table.deleteRow(1);
    }
    for(let i = 0; i < Characters.length; i++){
        let canPrint = true;
        for(let j = 0; j < dataButtons.length; j++){
            for(let k = 0; k < dataButtons[j].length; k++){
                if(dataButtons[j][k] == 2 && Characters[i][j+2] == dataNames[j][k]){
                    canPrint = false;
                }
                if(dataButtons[j][k] == 1 && Characters[i][j+2] != dataNames[j][k]){
                    canPrint = false;
                }
            }
        }
        if(diference(i) == false){
            canPrint = false;
        }
        if(canPrint){
            let row = table.insertRow();
            for(let j = 0; j < Characters[i].length; j++){
                let cell = row.insertCell();
                cell.innerText = Characters[i][j];
            }
        }
    }
}