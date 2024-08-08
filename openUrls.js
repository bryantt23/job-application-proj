const TABS_TO_OPEN = 21
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

// Function to determine if a company can be visited based on its last visit timestamp
function canVisitCompany(companyLastVisitedOn) {
    return (companyLastVisitedOn === undefined || hasOneMonthPassed(companyLastVisitedOn))
}

function openUrlsInNewTabs(data) {
    console.log('Starting to open tabs...');
    for (const companyName in data) {
        const companyData = data[companyName]
        const { jobs } = companyData

        const companyLastVisitedOn = companyData?.lastVisitedOn
        const isCompanyVisitable = canVisitCompany(companyLastVisitedOn)

        // the company job urls have never been opened
        // or they have been opened after a month has passed 
        if (isCompanyVisitable) {
            for (const job of jobs) {
                const jobUrl = job?.job_url

                // Check if the job has a URL and
                if (jobUrl) {
                    console.log(`Opening job from company: ${companyName}`)
                    if (jobUrl !== 'Not found') {
                        window.open(job?.job_url, '_blank')
                        tabsOpened++
                    }
                    job.visitedOn = Date.now()
                    companyData.lastVisitedOn = Date.now()
                }
            }
        }

        if (tabsOpened >= TABS_TO_OPEN) {
            break
        }
    }
    console.log('Finished opening tabs.');
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

function getSortedData(data) {
    const sortedData = Object.entries(data).sort((a, b) => {
        const comparison = Number(canVisitCompany(b[1])) - Number(canVisitCompany(a[1]))
        if (comparison !== 0) {
            return comparison
        }
        return a[1].jobs.length - b[1].jobs.length
    })

    return Object.fromEntries(sortedData)
}

async function start() {
    const jsonData = await getJsonData()
    const sortedData = getSortedData(jsonData)
    openUrlsInNewTabs(sortedData)
    downloadJson(jsonData, 'companyDataOutputWithUrlsAndVisits.json')
}

start()