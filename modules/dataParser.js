function dataParser(items, numOfAgents) {
    let colors = ['#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6',
        '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
        '#80B300', '#809900', '#E6B3B3'
    ];
    let dataByTime = ''; //the dataByTime string to be put in place of datasets.
    let dataPointsCountByAgents = [];
    for (let ndx = 0; ndx < numOfAgents; ndx++) {
        let agentData = [];
        items.forEach(element => {
            let signature = element.signature;
            if (signature == ndx) {
                let timeStamp = element.timeStamp.toString();
                let year = parseInt(timeStamp.substring(0, 4));
                let month = parseInt(timeStamp.substring(4, 6));
                let day = parseInt(timeStamp.substring(6, 8));
                let hour = parseInt(timeStamp.substring(8, 10));
                let dataPt = new dataPoint(year, month, day, hour, element.dataValue);
                agentData.push(dataPt);
            }

        });

        agentData.sort((a, b) => a.x - b.x);

        dataPointsCountByAgents.push(agentData.length);

        let someSet = new dataSet(agentData, ndx);
        dataByTime = dataByTime + JSON.stringify(someSet);

        if (ndx != numOfAgents - 1) {
            dataByTime = dataByTime + ',\n';
        }
    }
    let dataByAgentsStr = ''
    dataPointsCountByAgents.forEach((element,ndx) => {
        dataByAgentsStr = dataByAgentsStr + "{\n\ty: " + element.valueOf().toString() + ",\n\t" +
        "indexLabel: \"Agent " + ndx.toString() + "\"\n},";
    })

    this.dataByAgents = dataByAgentsStr;
    this.dataByTime = dataByTime;
}

function dataSet(data, ndx) {
    this.type = "line";
    this.showInLegend = true;
    this.legendText = "Agent " + ndx.toString();
    this.xValueType = "dateTime",
    this.dataPoints = data;
    return this;
}

function dataPoint(year, month, day, hour, value) {
    this.x = Date.UTC(year,month-1,day,hour);
    this.y = value;
    return this;
}

module.exports = dataParser;