const TABS_TO_OPEN = 21
let companiesVisited = 0

start()
async function start() {
    const jsonData = await getJsonData()
    const sortedData = getSortedData(jsonData)
    openUrlsInNewTabs(sortedData)
    downloadJson(jsonData, 'companyDataOutputWithUrlsAndVisits')
}

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

function openUrlsInNewTabs(data) {
    console.log('Starting to open tabs...');
    for (const companyName in data) {
        const companyData = data[companyName]
        const { jobs } = companyData

        const companyLastVisitedOn = companyData?.lastVisitedOn
        const minimumDaysBetweenVisit = 7 * 7
        const isCompanyVisitable = canVisitCompany(companyLastVisitedOn, minimumDaysBetweenVisit)

        // the company job urls have never been opened
        // or they have been opened after required time has passed
        if (isCompanyVisitable) {
            let openedCompanyJob = false
            for (const job of jobs) {
                const jobUrl = job?.job_url

                // Check if the job has a URL and
                if (jobUrl) {
                    console.log(`Opening job from company: ${companyName}`)
                    if (jobUrl !== 'Not found') {
                        window.open(job?.job_url, '_blank')
                        openedCompanyJob = true
                    }
                    job.visitedOn = Date.now()
                    companyData.lastVisitedOn = Date.now()
                }
            }
            if (openedCompanyJob) {
                companiesVisited++
            }
        }

        if (companiesVisited >= TABS_TO_OPEN) {
            break
        }
    }
    console.log('Finished opening tabs.');
}

// Function to determine if a company can be visited based on its last visit timestamp
function canVisitCompany(companyLastVisitedOn, daysBetweenVisits = 28) {
    return (companyLastVisitedOn === undefined || haveRequiredNumberOfDaysPassed(companyLastVisitedOn, daysBetweenVisits))
}

function haveRequiredNumberOfDaysPassed(timestampMs, requiredDays) {
    const currentTime = new Date().getTime()
    const oneMonthInMs = requiredDays * 24 * 60 * 60 * 1000;
    return currentTime >= timestampMs + oneMonthInMs
}

function downloadJson(data, fileNamePrefix = 'updated_jobs') {
    // Get the current date and time
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    const hours = String(now.getHours()).padStart(2, '0')
    const minutes = String(now.getMinutes()).padStart(2, '0')

    // Format the date and time as MM-DD-YYYY-HH-mm (24-hour format)
    const dateTimeSuffix = `${month}-${day}-${year}-${hours}-${minutes}`

    // Create the full file name
    const fileName = `${fileNamePrefix}-${dateTimeSuffix}.json`

    // Convert the data to a JSON string and encode it for download
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 4))
    const downloadAnchor = document.createElement('a')
    downloadAnchor.setAttribute('href', dataStr)
    downloadAnchor.setAttribute('download', fileName)
    document.body.appendChild(downloadAnchor)
    downloadAnchor.click()
    downloadAnchor.remove()
}