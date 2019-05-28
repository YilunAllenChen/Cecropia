function dataParser(items, numOfAgents) {
    let colors = ['#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6', 
    '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
    '#80B300', '#809900', '#E6B3B3'];
    let chartData = []; //all the datas.
    let replacement = ''; //the replacement string to be put in place of datasets.
    for (let ndx = 0; ndx < numOfAgents; ndx++) {
        let agentData = [];
        chartData[ndx] = [];
        items.forEach(element => {
            let signature = Object.values(element)[1];
            if(signature == ndx){
                agentData.push(element.dataValue);
            }
        })
        chartData[ndx] = agentData;
        let someSet = new dataSet(chartData[ndx],'agent ' + ndx,colors[ndx]);
        replacement = replacement + JSON.stringify(someSet);
    }
    console.log(replacement);
    this.replacement = replacement;
}

function dataSet(data, label, color){
    this.data = data;
    this.label = label;
    this.color = color;
    return this;
}


module.exports = dataParser;