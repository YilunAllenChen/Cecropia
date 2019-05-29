var moment = require('moment');
moment().format();

function dataParser(items, numOfAgents) {
    let colors = ['#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6',
        '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
        '#80B300', '#809900', '#E6B3B3'];
    let chartData = []; //all the datas.
    let replacement = ''; //the replacement string to be put in place of datasets.
    let dataPointsCountByAgents = [];
    for (let ndx = 0; ndx < numOfAgents; ndx++) {
        let agentData = [];
        chartData[ndx] = [];
        items.forEach(element => {
            let signature = Object.values(element)[1];
            if (signature == ndx) {
                let timeStamp = Object.values(element)[2];
                let dataPt = new dataPoint(timeStamp, element.dataValue);
                agentData.push(dataPt);
            }

        });

        chartData[ndx] = agentData;

        agentData.sort((a, b) => new moment(a.x).format('YYYYMMDDHH') - new moment(b.x).format('YYYYMMDDHH'));

        console.log(agentData, '\n');

        dataPointsCountByAgents.push(agentData.length);

        let someSet = new dataSet(agentData, 'agent ' + ndx, colors[ndx]);
        replacement = replacement + JSON.stringify(someSet);

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

function dataPoint(x, y) {
    this.x = x;
    this.y = y;
    return this;
}

module.exports = dataParser;