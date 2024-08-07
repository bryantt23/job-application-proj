const TABS_TO_OPEN = 7
let tabsOpened = 0

function getJsonData() {
    return new Promise(resolve => {
        // Create an input element of type file
        const input = document.createElement('input')
        input.type = 'file'
        input.accept = 'application/json' // Accept only JSON files

        // Add an event listener to handle the file once selected
        input.onchange = e => {
            // Get the selected file
            const file = e.target.files[0]
            const reader = new FileReader()

            // Define what happens once the file is read
            reader.onload = event => {
                try {
                    // Parse the JSON data from the file
                    const json = JSON.parse(event.target.result)
                    resolve(json)
                } catch (error) {
                    console.error('Failed to parse JSON:', error);
                }
            };

            // Read the file as text
            reader.readAsText(file)
        };

        // Trigger the file input to open the file selection dialog
        input.click();
    })
}

function openUrlsInNewTabs(data) {
    for (const companyName in data) {
        const companyData = data[companyName]
        const { jobs } = companyData

        for (const job of jobs) {
            const jobUrl = job?.job_url
            const companyLastVisitedOn = companyData?.lastVisitedOn

            // Check if the job has a URL and
            // the company job urls have never been opened
            // or they have been opened after a month has passed 
            if (jobUrl && (companyLastVisitedOn === undefined || hasOneMonthPassed(companyLastVisitedOn))) {
                window.open(job?.job_url, '_blank')
                job.visitedOn = Date.now()
                companyData.lastVisitedOn = Date.now()
                tabsOpened++
            }
        }
        if (tabsOpened >= TABS_TO_OPEN) {
            break
        }
    }
}

function hasOneMonthPassed(timestampMs) {
    const currentTime = new Date().getTime()
    const oneMonthInMs = 30 * 24 * 60 * 60 * 1000;
    return currentTime >= timestampMs + oneMonthInMs
}

function downloadJson(data, fileName = 'updated_jobs.json') {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 4))
    const downloadAnchor = document.createElement('a')
    downloadAnchor.setAttribute('href', dataStr)
    downloadAnchor.setAttribute('download', fileName)
    document.body.appendChild(downloadAnchor)
    downloadAnchor.click()
    downloadAnchor.remove()
}

async function start() {
    const jsonData = await getJsonData()
    openUrlsInNewTabs(jsonData)
    downloadJson(jsonData, 'companyDataOutputWithVisits.json')
}

start()