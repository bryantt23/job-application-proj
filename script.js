{
    //https://himalayas.app/jobs
    const PAGES_TO_OPEN = 3
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'application/json'

    let companyData = new Map()
    const delay = (timeDelay) => {
        return new Promise(resolve => {
            setTimeout(resolve, timeDelay)
        })
    }

    const addCompanyData = () => {
        const articles = Array.from(document.querySelectorAll("article"))
        for (const article of articles) {
            const url = article.querySelector('a').href
            const companyName = article.querySelector('a.inline-flex.items-center.font-medium.text-gray-900').innerText;
            const jobTitle = article.querySelector('a.text-xl.font-medium.text-gray-900.md\\:w-112.md\\:truncate').innerText
            // maybe in future check if addedDate is over a certain time period
            const job = {
                addedDate: Date.now(),
                url,
                jobTitle
            }

            if (!companyData.has(companyName)) {
                console.log("Adding:", companyName)
                companyData.set(companyName, {
                    jobs: []
                })
            }

            // Check if the job URL already exists in the jobs array
            const companyJobs = companyData.get(companyName).jobs
            if (!companyJobs.some(existingJob => existingJob.url === url)) {
                companyJobs.push(job)
            }
        }
        console.log(`There are now ${companyData.size} companies`)

        return articles.length > 0;
    }

    async function fetchCompanyDataWithRetry(maxAttempts, interval) {
        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
            const hasData = addCompanyData()
            if (hasData) {
                return hasData
            }
            await delay(interval)
        }
        throw new Error("Failed to fetch company data after maximum attempts")
    }

    function openFile() {
        return new Promise((resolve, reject) => {
            // Open file selector
            input.click();

            // Handle file selection and reading
            input.addEventListener('change', async (event) => {
                const file = event.target.files[0]
                if (!file) {
                    reject('No file selected')
                    return
                }

                try {
                    const text = await file.text()
                    const jsonData = JSON.parse(text)
                    console.log("Parsed JSON data:", jsonData);
                    companyData = new Map(Object.entries(jsonData))
                    resolve()
                } catch (error) {
                    console.error('Invalid JSON file:', error);
                    reject(error)
                }
            }, { once: true });
        })
    }

    function updateJsonFile() {
        // Modify the JSON content
        const jsonData = Object.fromEntries(companyData.entries())

        // Save the modified JSON back to the file
        const modifiedJsonStr = JSON.stringify(jsonData, null, 4)
        const blog = new Blob([modifiedJsonStr], { type: 'application/json' })
        const url = URL.createObjectURL(blog)
        const a = document.createElement('a')
        a.href = url;
        a.download = 'companyData.json'
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url) // Clean up the object URL
    }

    async function navigatePages() {
        await openFile()

        for (let i = 0; i < PAGES_TO_OPEN; i++) {
            await fetchCompanyDataWithRetry(21, 1000)
            console.log(`On page ${i + 1}`)
            await clickNext()
        }

        updateJsonFile()
    }

    async function clickNext() {
        const previousUrl = window.location.href
        const aTags = Array.from(document.querySelectorAll('a'))
        const nextButton = aTags
            .find(a => Array.from(a.childNodes).some(child => child.textContent === 'Next'))

        if (nextButton) {
            nextButton.click()
            // Wait until the URL changes
            await new Promise(resolve => {
                const checkUrlChange = () => {
                    if (window.location.href !== previousUrl) {
                        resolve()
                    }
                    else {
                        requestAnimationFrame(checkUrlChange)
                    }
                }
                requestAnimationFrame(checkUrlChange)
            })
        }
        else {
            throw new Error('Next button not found')
        }
    }

    navigatePages()
}