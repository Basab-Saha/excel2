//adding blur event listener to every cell
// eta korle ekta cell theke onno cell e chole gale
//last cell er valu=jeta type korte korte chole giyechilam

for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
        let cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
        cell.addEventListener("blur", (e) => {
            let address = addressBar.value;
            let [activeCell, cellProp] = getActiveCell(address);
            let enteredData = activeCell.innerText;

            if (enteredData === cellProp.value) return;

            cellProp.value = enteredData;
            console.log(sheetDB)
            // If data modifies remove P-C relation, formula empty, update children with new hardcoded (modified) value
            removeChildFromParent(cellProp.formula);
            cellProp.formula = "";
            updateChildrenCells(address);
        })
    }
}
//formula bar e giye kono expression likhe enter tiple
//oi cell er innertext change hobe
//oi cell er state er value property ar formulaProperty change hobe
let formulaBar=document.querySelector(".formula-bar");

formulaBar.addEventListener("keydown",async (e)=>{
    let inputFormula=formulaBar.value;  //formulaBar is a input element
    if(e.key==="Enter" && inputFormula){
        //jodi ei formula bar e ager formula theke alada formula likhi
        let address=addressBar.value;
        let [activeCell,cellProp]=getActiveCell(address);
        if(inputFormula!==cellProp.formula){
            removeChildFromParent(cellProp.formula);
        }

        //child ke parent er child list e add korte hobe (for graph building)
        addChildToGraphComponent(inputFormula,address);

        //child ke tokhoni add korbo graph e if it dont make any cycle
        let cycleResponse = isGraphCyclic(graphComponentMatrix);
        
        if (cycleResponse) {
           //there is a cycle 
           let response = confirm("Cycle detected ! do u want to trace it ?");
           while(response===true){
             // do cycle tracing ( it will be async fxn so i have to wait)
             await  isGraphCyclicTrace(graphComponentMatrix,cycleResponse);
           
           
             //now again take response
             response=confirm("Cycle detected ! do u want to trace it ?");
           }
           formulaBar.value="";
           removeChildFromGraphComponent(inputFormula,address);
           return;
        }


        //determining the value of input formula
        let evaluatedValue=evaluateFormula(inputFormula);

        //UI change and Data update :
        setCellUIAndProps(evaluatedValue,inputFormula,address);

        //child addition to parent
        addChildToParent(inputFormula);

        //update children cells
        updateChildrenCells(address);
    }
})

function removeChildFromGraphComponent(inputFormula, address) {
    let [rid, cid] = decodeRIDCIDFromAddress(address);
    let formulaTokens = inputFormula.split(" ");
    for (let i = 0; i < formulaTokens.length; i++) {
        let ascii = formulaTokens[i].charCodeAt(0);
        if (ascii >= 65 && ascii <= 90) {
            let [parentRID, parentCID] = decodeRIDCIDFromAddress(formulaTokens[i]);
            graphComponentMatrix[parentRID][parentCID] = graphComponentMatrix[parentRID][parentCID].filter(
                ([r, c]) => !(r === rid && c === cid)
            );
        }
    }
}

function addChildToGraphComponent(inputFormula, address) {
    let [rid, cid] = decodeRIDCIDFromAddress(address);
    let formulaTokens = inputFormula.split(" ");
    for (let i = 0; i < formulaTokens.length; i++) {
        let ascii = formulaTokens[i].charCodeAt(0);
        if (ascii >= 65 && ascii <= 90) {
            let [parentRID, parentCID] = decodeRIDCIDFromAddress(formulaTokens[i]);
            graphComponentMatrix[parentRID][parentCID].push([rid, cid]);
        }
    }
}


//notun formula dile notun parent child relation banate hobe
function addChildToParent(inputFormula){
    let childAddress=addressBar.value;
    let formulaTokens=inputFormula.split(" ");
    for(let i=0;i<formulaTokens.length;i++){
        let ascii=formulaTokens[i].charCodeAt(0);
        if(ascii>=65 && ascii<=90){
            let [parentCell,parentCellProp]=getActiveCell(formulaTokens[i]);
            parentCellProp.children.push(childAddress);
        }
    }
    console.log(sheetDB);
}

//notun formula dile ager parent child relation break korte hobe
function removeChildFromParent(oldInputFormula){
    let childAddress=addressBar.value;
    let formulaTokens=oldInputFormula.split(" ");
    for(let i=0;i<formulaTokens.length;i++){
        let ascii=formulaTokens[i].charCodeAt(0);
        if(ascii>=65 && ascii<=90){
            let [parentCell,parentCellProp]=getActiveCell(formulaTokens[i]);
            let idx=parentCellProp.children.indexOf(childAddress);
            parentCellProp.children.splice(idx,1);
        }
    }
}

//formula bar e new experssion (dependednt or numerical) dewar fole notun result asle
//oi cell er child der update koro
function updateChildrenCells(parentAddress) {
    let [parentCell, parentCellProp] = getActiveCell(parentAddress);
    let children = parentCellProp.children;

    for (let i = 0; i < children.length; i++) {
        let childAddress = children[i];
        let [childCell, childCellProp] = getActiveCell(childAddress);
        let childFormula = childCellProp.formula;

        let evaluatedValue = evaluateFormula(childFormula);
        setCellUIAndProps(evaluatedValue, childFormula, childAddress);
        updateChildrenCells(childAddress);
    }
}



//depended expression as well as  numerical expression evaluate korbe
function evaluateFormula(inputFormula){
    //suppose formula : A1 + B1 + C2 we have to convert it in-> 10+20+30 
    //step 1 : space(" ") er basis e string ke split kore array te convert korbo
    //so A1 is a element of array and + is a element of array
    let formulaTokens=inputFormula.split(" ");
    for(let i=0;i<formulaTokens.length;i++){
        let ascii=formulaTokens[i].charCodeAt(0);
        if(ascii>=65 && ascii<=90){
            //formulatoken[i]= "A1" type:
            let[cell , cellProp]=getActiveCell(formulaTokens[i]);
            formulaTokens[i]=cellProp.value;
        }
    }
    let decodedFormula=formulaTokens.join(" ");
    return eval(decodedFormula);
}

//UI change and Data update of the current cell (jar opor formula apply kora hoise)
function setCellUIAndProps(evaluatedValue,inputFormula,address){
    //address bar theke active cell access kore
    
    let [activeCell,cellProp]=getActiveCell(address);

    //UI update
    activeCell.innerText=evaluatedValue;

    //Cell storage state update
    cellProp.value=evaluatedValue;
    cellProp.formula=inputFormula;
}


// suppose A1 depends on B1 and B1 depends on C1
// so if C1 changes tahole C1 er opor jara jara dependent
// tader value o update hobe in the way they are using C1 in their formula

//jodi kono cell er formula bar er formula change kori
//tahole je parent child relation gulo chilo segulo break korte hobe
//and new parent child relation banate hobe
