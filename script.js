{
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'application/json'

    const companyData = {}
    const delay = (timeDelay) => {
        return new Promise(resolve => {
            setTimeout(resolve, timeDelay)
        })
    }

    const getCompanyData = () => {
        const articles = Array.from(document.querySelectorAll("article"))
        // console.log("🚀 ~ getCompanyData ~ articles:", articles)

        for (let i = 0; i < articles.length; i++) {
            const article = articles[i]
            const url = article.querySelector('a').href
            const companyName = article.querySelector('a.inline-flex.items-center.font-medium.text-gray-900').innerText;
            // if (companyData[])
            //     companyData.push({ companyName, url })
        }

        if (companyData.length > 0) {
            console.log("🚀 ~ getCompanyData ~ companyData:", companyData)
            return companyData
        }

        return null
    }

    async function fetchCompanyDataWithRetry(maxAttempts, interval) {
        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
            const data = getCompanyData()
            if (data) {
                return data
            }
            await delay(interval)
        }
        throw new Error("Failed to fetch company data after maximum attempts")
    }

    async function navigatePages() {
        // Step 1: Open file selector
        input.click();

        // Step 2: Handle file selection and reading
        input.addEventListener('change', async (event) => {
            const file = event.target.files[0]
            if (!file) {
                return
            }

            const text = await file.text()
            console.log("Original file contents:", text);

            // Step 3: Parse the JSON content
            let jsonData
            try {
                jsonData = JSON.parse(text)
            } catch (error) {
                console.error('Invalid JSON file:', e);
                return;
            }

            console.log("Parsed JSON data:", jsonData);

            // Step 4: Modify the JSON content
            jsonData.message = "c u l8r"

            // Step 5: Save the modified JSON back to the file
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
        });


        // for (let i = 0; i < 3; i++) {
        //     getCompanyData()
        //     await clickNext()
        // }
    }

    async function clickNext() {
        const nextButton = document.querySelector('nav[aria-label="pagination"] .flex.flex-row-reverse.h-full.w-full.items-center.justify-center[href*="?page="]');

        if (nextButton) {
            nextButton.click()
            await delay(3000)
        }
    }

    navigatePages()
}