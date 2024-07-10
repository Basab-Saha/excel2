let collectedGraphComponent=[];
let graphComponentMatrix=[];
//checkin for cycle
function isGraphCyclic(graphComponentMatrix){
    //dependency->visited , dfsVis (2d array)
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

    //dfs call for each cell
    for(let i=0;i<rows;i++){
        for(let j=0;j<cols;j++){
            let res=dfsCycleDetect(graphComponentMatrix,i,j,visited,dfsVisited);
            if(res) return [i,j];
        }
    }
    return false;
}

function dfsCycleDetect(graphComponentMatrix, srcr, srcc, visited, dfsVisited) {
    visited[srcr][srcc] = true;
    dfsVisited[srcr][srcc] = true;

    // A1 -> [ [0, 1], [1, 0], [5, 10], .....  ]
    for (let children = 0; children < graphComponentMatrix[srcr][srcc].length; children++) {
        let [nbrr, nbrc] = graphComponentMatrix[srcr][srcc][children];
        if (visited[nbrr][nbrc] === false) {
            let response = dfsCycleDetect(graphComponentMatrix, nbrr, nbrc, visited, dfsVisited);
            if (response === true) return true; // Found cycle so return immediately, no need to explore more path
        }
        else if (visited[nbrr][nbrc] === true && dfsVisited[nbrr][nbrc] === true) {
            // Found cycle so return immediately, no need to explore more path
            return true;
        }
    }

    dfsVisited[srcr][srcc] = false;
    return false;
}

 
