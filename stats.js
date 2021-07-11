function quantile(arr, q) {
    const sorted = arr.sort((a, b) => a - b);
    const pos = (sorted.length - 1) * q;
    const base = Math.floor(pos);
    const rest = pos - base;

    if (sorted[base + 1] !== undefined) {
        return Math.floor(sorted[base] + rest * (sorted[base + 1] - sorted[base]));
    } else {
        return Math.floor(sorted[base]);
    }
};

function prepareData(result) {
	return result.data.map(item => {
		item.date = item.timestamp.split('T')[0];

		return item;
	});
}

// показать значение метрики за несколько день
function showMetricByPeriod(data, page, name, dateStart, dateFinish) {
	let sampleData = data
					.filter(item => item.page == page && item.name == name && item.date == date)
					.map(item => item.value);

	console.log(`${dateFinish} - ${dateStart} ${name}: ` +
		`p25=${quantile(sampleData, 0.25)} p50=${quantile(sampleData, 0.5)} ` +
		`p75=${quantile(sampleData, 0.75)} p90=${quantile(sampleData, 0.95)} ` +
		`hits=${sampleData.length}`);
}

// показать сессию пользователя
function showSession(data, requestId) {
    let sampleData = data
					.filter(item => item.requestId === requestId)
					.map(item => item.value);

	console.log(`${requestId}: ` + sampleData);
}

// сравнить метрику в разных срезах
function compareMetric(data, page, name, date) {
    
}

// рассчитать метрику за выбранный день
function calcMetricByDate(data, page, name, date) {
	let sampleData = data
					.filter(item => item.page == page && item.name == name && item.date == date)
					.map(item => item.value);

	console.log(`${date} ${name}: ` +
		`p25=${quantile(sampleData, 0.25)} p50=${quantile(sampleData, 0.5)} ` +
		`p75=${quantile(sampleData, 0.75)} p90=${quantile(sampleData, 0.95)} ` +
		`hits=${sampleData.length}`);
}

fetch('https://shri.yandex/hw/stat/data?counterId=c37fb99d-16b6-4948-af5f-25e89921b1b9')
	.then(res => res.json())
	.then(result => {
		let data = prepareData(result);

		calcMetricByDate(data, 'send test', 'connect', '2021-07-11');
		calcMetricByDate(data, 'send test', 'ttfb', '2021-07-11');
		calcMetricByDate(data, 'send test', 'load', '2021-07-11');

		showMetricByPeriod(data, 'send test', 'name', '2021-07-03', '2021-07-11');
		showSession(data, data[0].requestId);
		compareMetric(data, 'send test', 'connect', '2021-07-11');
	});