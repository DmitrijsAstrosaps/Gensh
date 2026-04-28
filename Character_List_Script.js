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
    [0, 0], // 4 star, 5 star
    [0, 0, 0, 0, 0, 0, 0], // Anemo, Geo, Electro, Dendro, Hydro, Pyro, Cryo
    [0, 0, 0, 0, 0], // Sword, Claymore, Polearm, Bow, Catalyst
    [0, 0, 0, 0, 0, 0, 0, 0, 0], // Mondstadt, Liyue, Inazuma, Sumeru, Fontaine, Natlan, Nod-Krai, Snezhnaya, Outlander
    [0, 0, 0] // up, equale, down
];

function test_function(thing, id, btn){
    thing[id] += 1;
    if (thing[id] == 3) thing[id] = 0;
    
    switch(thing[id]){
        case 0:
            btn.style.backgroundColor = "white";
            break;
        case 1:
            btn.style.backgroundColor = "green";
            break;
        case 2:
            btn.style.backgroundColor = "red";
            break;
    }
}

function version(thing, id, btn){
    thing[id] += 1;
    if (thing[id] == 2) thing[id] = 0;
    
    switch(thing[id]){
        case 0:
            btn.style.backgroundColor = "white";
            break;
        case 1:
            btn.style.backgroundColor = "green";
            break;
    }
}

function diference(i){
    if(dataButtons[4][0] == 1 && dataButtons[4][2] == 1){
        var upVersion = document.getElementById("up").value;
        var downVersion = document.getElementById("down").value;
        return Characters[i][6] > parseFloat(upVersion) && Characters[i][6] < parseFloat(downVersion);
    }
    if(dataButtons[4][0] == 1){
        var upVersion = document.getElementById("up").value;
        return Characters[i][6] > parseFloat(upVersion);
    }
    if(dataButtons[4][1] == 1){
        var equaleVersion = document.getElementById("equale").value;
        return Characters[i][6] == parseFloat(equaleVersion);
    }
    if(dataButtons[4][2] == 1){
        var downVersion = document.getElementById("down").value;
        return Characters[i][6] < parseFloat(downVersion);
    }
}

function PrintTable() {
    var table = document.getElementById("Trysss");
    while (table.rows.length > 1) {
        table.deleteRow(1);
    }
    for(let i = 0; i < Characters.length; i++){
        let canPrint = true;
        for(let j = 0; j < dataButtons.length-1; j++){
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