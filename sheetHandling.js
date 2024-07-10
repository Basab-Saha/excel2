let activeSheetColor="#ced6e0";

let sheetsFolderCont=document.querySelector(".sheets-folder-cont");
let addSheetBtn=document.querySelector(".sheet-add-icon");

addSheetBtn.addEventListener("click",(e)=>{

    //create sheet icon 
    let sheet=document.createElement("div");
    sheet.setAttribute("class","sheet-folder");
    
    //unique id for each sheet
    let allSheetFolders=document.querySelectorAll(".sheet-folder");
    sheet.setAttribute("id",allSheetFolders.length); //len+1 korchi na coz 0 based index
    sheet.innerHTML=
    `<div class="sheet-content">Sheet${allSheetFolders.length+1}</div>`

    sheetsFolderCont.appendChild(sheet);
    createSheetDB();
    createGraphComponentMatrix();

    //to show particular sheet when clicked
    handleSheetActiveness(sheet); // sheet e click event listener add korlam
    handleSheetRemoval(sheet);  //sheet e right click event listener add korlam

    sheet.click(); //default sheet create hobe and show korbe
});

function handleSheetRemoval(sheet) {
    sheet.addEventListener("mousedown", (e) => {
        // Right click
        if (e.button !== 2) return;

        let allSheetFolders = document.querySelectorAll(".sheet-folder");
        if (allSheetFolders.length === 1) {
            alert("You need to have atleast one sheet!!");
            return;
        }

        let response = confirm("Your sheet will be removed permanently, Are you sure?");
        if (response === false) return;

        let sheetIdx = Number(sheet.getAttribute("id"));
        // DB
        collectedSheetDB.splice(sheetIdx, 1);
        collectedGraphComponent.splice(sheetIdx, 1);
        // UI
        handleSheetUIRemoval(sheet)

        // By default DB to sheet 1 (active)
        sheetDB = collectedSheetDB[0];
        graphComponentMatrix = collectedGraphComponent[0];
        handleSheetProperties();
    })
}

function handleSheetUIRemoval(sheet) {
    sheet.remove();
    let allSheetFolders = document.querySelectorAll(".sheet-folder");
    for (let i = 0;i < allSheetFolders.length;i++) {
        allSheetFolders[i].setAttribute("id", i);
        let sheetContent = allSheetFolders[i].querySelector(".sheet-content");
        sheetContent.innerText = `Sheet ${i+1}`;
        allSheetFolders[i].style.backgroundColor = "transparent";
    }

    allSheetFolders[0].style.backgroundColor = activeSheetColor;
}

function handleSheetUI(sheet){
    let allSheetFolders=document.querySelectorAll(".sheet-folder");
    for(let i=0;i<allSheetFolders.length;i++){
        allSheetFolders[i].style.backgroundColor="transparent";
    }
    sheet.style.backgroundColor=activeSheetColor;
}

function handleSheetDB(sheetIdx){
    sheetDB=collectedSheetDB[sheetIdx];
    graphComponentMatrix=collectedGraphComponent[sheetIdx];
}
function handleSheetProperties(){
    for(let i=0;i<rows;i++){
        for(let j=0;j<cols;j++){
            let cell=document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
            cell.click();
        }
    }
    //excel khullei jano first ei by default 1st cell select kora thake
    let firstCell=document.querySelector(".cell"); 
    //je je element er class="cell" ache tader modhye sobar 1st element select kora
    firstCell.click(); //click event fire korlam
}
function handleSheetActiveness(sheet){

    sheet.addEventListener("click",(e)=>{

    let sheetIdx=  Number(sheet.getAttribute("id")); //via 0 based index of sheet div 
        handleSheetDB(sheetIdx); //sets current sheetDB and graphComponentMatrix
        //sheetDB notun set korar por cell properties update korar jonno
        //i will click on all cells
        handleSheetProperties();
        handleSheetUI(sheet);
    })
}
function createSheetDB(){
     //Storage Matrix for stroing cell state
 let sheetDB=[];

 for(let i=0 ; i<rows;i++){
    let sheetRow=[];
    for(let j=0;j<cols;j++){
       let cellProps={
            bold:false,
            italic:false,
            underline:false,
            alignment:"left",
            fontFamily:"monospace",
            fontSize:"14",
            fontColor:"#000000",
            BGColor:"#000000", //just for indication (def value)
            value:"" ,//cell er actual value
            formula:"" ,//cell er formula value
            children:[] //child cells of the current cell
       }
       sheetRow.push(cellProps); 
    }
    sheetDB.push(sheetRow);
 }
 collectedSheetDB.push(sheetDB);
}

function createGraphComponentMatrix(){
    let graphComponentMatrix=[];
for(let i=0;i<rows;i++){
    let row=[]
    for(let j=0;j<cols;j++){
        row.push([]); //more than 1 child can be there
    }
    graphComponentMatrix.push(row);
}
collectedGraphComponent.push(graphComponentMatrix);

}