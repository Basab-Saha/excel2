

async function isGraphCyclicTrace(graphComponentMatrix,cycleResponse){
    //dependency->visited , dfsVis (2d array)
    let[i,j]=cycleResponse;
    let visited=[];
    let dfsVisited=[];

    for(let i=0;i<rows;i++){
        let visitedRow=[];
        let dfsVisitedRow=[];

        for(let j=0;j<cols;j++){
            visitedRow.push(false);
            dfsVisitedRow.push(false);
        }
        visited.push(visitedRow);
        dfsVisited.push(dfsVisitedRow);
    }

   let res=await dfsCycleDetectTrace(graphComponentMatrix,i,j,visited,dfsVisited);
   if(res===true){
    //if cycle tracing done then return a promise
    return Promise.resolve(true);
   }
   return Promise.resolve(false);
}

//just for delay purpose 
function colorPromise(){
    return new Promise((resolve,reject)=>{
        setTimeout(()=>{
           resolve();
        },1000)
    
    })
}


async function dfsCycleDetectTrace(graphComponentMatrix, srcr, srcc, visited, dfsVisited) {
    visited[srcr][srcc] = true;
    dfsVisited[srcr][srcc] = true;

    let cell=document.querySelector(`[rid="${srcr}"][cid="${srcc}"]`);
    cell.style.backgroundColor="lightblue";
    //1 sec delay
    await colorPromise();
   
    
    for (let children = 0; children < graphComponentMatrix[srcr][srcc].length; children++) {
        let [nbrr, nbrc] = graphComponentMatrix[srcr][srcc][children];
        if (visited[nbrr][nbrc] === false) {
            let response = await dfsCycleDetectTrace(graphComponentMatrix, nbrr, nbrc, visited, dfsVisited);
            if (response === true) {

                    cell.style.backgroundColor="transparent";
                    //perform delay
                    await colorPromise();
                
                return Promise.resolve(true);
            }
        }
        else if (visited[nbrr][nbrc] === true && dfsVisited[nbrr][nbrc] === true) {
           let cyclicCell=document.querySelector(`[rid="${nbrr}"][cid="${nbrc}"]`);
          
           //cylic cell er jonyo
           cyclicCell.style.backgroundColor = "lightsalmon";
            await colorPromise();
            cyclicCell.style.backgroundColor = "transparent";
            await colorPromise();

            //je cell call koreche tar jonyo
            cell.style.backgroundColor="transparent";
            //perform delay
            await colorPromise();

           
            

            return Promise.resolve(true);
        }
    }

    dfsVisited[srcr][srcc] = false;
    return Promise.resolve(false);
}