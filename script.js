{
    const delay = (timeDelay) => {
        return new Promise(resolve => {
            setTimeout(resolve, timeDelay)
        })
    }

    const getCompanyData = () => {
        const companyData = []
        const articles = Array.from(document.querySelectorAll("article"))
        // console.log("🚀 ~ getCompanyData ~ articles:", articles)

        for (let i = 0; i < articles.length; i++) {
            const article = articles[i]
            const url = article.querySelector('a').href
            const companyName = article.querySelector('a.inline-flex.items-center.font-medium.text-gray-900').innerText;
            companyData.push({ companyName, url })
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
        for (let i = 0; i < 3; i++) {
            getCompanyData()
            clickNext()
            await delay(3000)
        }
    }

    function clickNext() {
        const nextButton = document.querySelector('nav[aria-label="pagination"] .flex.flex-row-reverse.h-full.w-full.items-center.justify-center[href*="?page="]');
        console.log("🚀 ~ clickNext ~ nextButton:", nextButton)

        if (nextButton) {
            nextButton.click()
        }
    }
    navigatePages()
}