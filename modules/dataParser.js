function dataParser(items, numOfAgents) {
    let colors = ['#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6',
        '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
        '#80B300', '#809900', '#E6B3B3'];
    let chartData = []; //all the datas.
    let replacement = ''; //the replacement string to be put in place of datasets.
    let dataPointsCountByAgents = [];
    for (let ndx = 0; ndx < numOfAgents; ndx++) {
        let agentData = '{data: [';
        chartData[ndx] = [];
        let dataCount = 0;
        let isEmpty = true;
        items.forEach(element => {
            let signature = Object.values(element)[1];
            if (signature == ndx) {
                let timeStamp = "\"" + Object.values(element)[2] + "\"";
                let dataPoint = "{x: " + timeStamp + ", y: " + element.dataValue + "},";
                agentData = agentData + dataPoint;
                dataCount = dataCount + 1;
                isEmpty = false;
            }
            
        });
        if(!isEmpty){
            agentData = agentData.substr(0,agentData.length-1)
        }
        agentData = agentData + "],\nlabel: 'Agent " + ndx + "',\nfill: false, \nborderColor: '" + colors[ndx] + "'\n}";
        chartData[ndx] = agentData;

        dataPointsCountByAgents.push(dataCount);


        // let someSet = new dataSet(chartData[ndx], 'agent ' + ndx, colors[ndx]);
        // replacement = replacement + JSON.stringify(someSet);

        replacement = replacement + agentData;
        console.log(replacement);
        if (ndx != numOfAgents - 1) {
            replacement = replacement + ',\n';
        }
    }
    this.chartData = chartData;
    this.dataByAgents = '[' + dataPointsCountByAgents.toString() + ']';
    this.replacement = replacement;
    this.dataCount = items.length;
}

function dataSet(data, label, color) {
    this.data = data;
    this.label = label;
    this.borderColor = color;
    this.fill = false;
    return this;
}


module.exports = dataParser;