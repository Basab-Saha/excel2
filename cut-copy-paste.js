let ctrlKey;
document.addEventListener("keydown", (e) => {
    ctrlKey = e.ctrlKey;
})
document.addEventListener("keyup", (e) => {
    ctrlKey = e.ctrlKey;
})

//first e range select korbo so proti ta cell er upor click event add korbo
for(let i=0;i<rows;i++){
    for(let j=0;j<cols;j++){
        let cell=document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
        handleSelectedCells(cell);
    }

}
//range select korar jonno ekta array banabo
let rangeStorage=[];
function handleSelectedCells(cell){

    cell.addEventListener("click",(e)=>{
        //cell er opor click kora hoache

        //jodi ctrl key press na thake tahole bhai jao 
        if(!ctrlKey) return;

        //jodi already duto cell select kore ni tahole bhai
        //notun range select hobe from this cell
        if(rangeStorage.length>=2){
            makeAllCellsUnselect();
            rangeStorage=[];
        }

    //sob thik thak thakle:
        //border ta deep kore dao :
        cell.style.border="2px solid black";

        //rangestorage e push kore dao cell cordinates
        let rid=Number(cell.getAttribute("rid"));
        let cid=Number(cell.getAttribute("cid"));
        rangeStorage.push({rid,cid});
    })
}

//proti ta cell ke abar unselect korchi
function makeAllCellsUnselect(){
    for(let i=0;i<rangeStorage.length;i++){
        let {rid,cid}=rangeStorage[i];
        let cell=document.querySelector(`.cell[rid="${rid}"][cid="${cid}"]`);
        cell.style.border="1px solid lightgrey";
    }
   
}

let copyBtn=document.querySelector(".copy");
let cutBtn=document.querySelector(".cut");
let pasteBtn=document.querySelector(".paste");

//copu Btn e click korle:
let copyData=[];
copyBtn.addEventListener("click",(e)=>{
    //minimum 2 to cell select korte hobe (range select)
    if(rangeStorage.length<2) return;

    //selected range er sob cell er value copy kore rakhte hobe
    let stRow = rangeStorage[0].rid;
    let endRow = rangeStorage[1].rid;
    let stCol = rangeStorage[0].cid;
    let endCol = rangeStorage[1].cid;
    //console.log(rangeStorage)

    for(let i=stRow;i<=endRow;i++){
        let copyRow=[];
        for(let j=stCol;j<=endCol;j++){
            let cellProp = sheetDB[i][j];
            
            copyRow.push(cellProp);
        }
        copyData.push(copyRow);
    }
    console.log(copyData)
    //border remove kore dao copy te click korar por
    makeAllCellsUnselect();

})

pasteBtn.addEventListener("click",(e)=>{
    if(rangeStorage.length<2) return;

    let rowDiff=Math.abs(rangeStorage[0].rid-rangeStorage[1].rid);
    let colDiff=Math.abs(rangeStorage[0].cid-rangeStorage[1].cid);
   
   // console.log(copyData);
    let address=addressBar.value;
    let [targetRow,targetCol]=decodeRIDCIDFromAddress(address);
    //console.log(targetRow,targetCol)

    for(let i=targetRow, r=0;i<=targetRow+rowDiff;i++,r++){
        for(let j=targetCol,c=0;j<=targetCol+colDiff;j++,c++){
            let cell=document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
            
            //if out of bound
            if(!cell) continue;

            let data=copyData[r][c];
            let cellProp=sheetDB[i][j];

             // DB change
             cellProp.value = data.value;
             cellProp.bold = data.bold;
             cellProp.italic = data.italic;
             cellProp.underline = data.underline;
             cellProp.fontSize = data.fontSize;
             cellProp.fontFamily = data.fontFamily;
             cellProp.fontColor = data.fontColor;
             cellProp.BGColor = data.BGColor;
             cellProp.alignment = data.alignment;

             // UI change
             cell.click();

        }
    }

})

cutBtn.addEventListener("click",(e)=>{
     //minimum 2 to cell select korte hobe (range select)
     if(rangeStorage.length<2) return;

     //selected range er sob cell er value copy kore rakhte hobe
     let stRow = rangeStorage[0].rid;
     let endRow = rangeStorage[1].rid;
     let stCol = rangeStorage[0].cid;
     let endCol = rangeStorage[1].cid;
     //console.log(rangeStorage)
 
     for(let i=stRow;i<=endRow;i++){
         let copyRow=[];
         for(let j=stCol;j<=endCol;j++){
             let cellProp = sheetDB[i][j];
             let cellPropCopy={...cellProp};
             copyRow.push(cellPropCopy);

            
             let cell=document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
 
              // DB change
             
              cellProp.value = "";
              cellProp.bold = false;
              cellProp.italic = false;
              cellProp.underline = false;
              cellProp.fontSize = 14;
              cellProp.fontFamily = "monospace";
              cellProp.fontColor = "#000000";
              cellProp.BGcolor = "#000000";
              cellProp.alignment = "left";
 
              // UI change
              cell.click();
         }
         copyData.push(copyRow);
     }
     console.log(copyData)
     //border remove kore dao copy te click korar por
     makeAllCellsUnselect();
})