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
    for (const company in data) {
        const { jobs } = data[company]
        for (const job of jobs) {
            if (job?.job_url) {
                window.open(job?.job_url, '_blank')
                job.visited = true
            }
        }
    }
}

async function start() {
    const jsonData = await getJsonData()
    openUrlsInNewTabs(jsonData)
}

start()