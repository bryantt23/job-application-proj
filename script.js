{
    const delay = (timeDelay) => {
        return new Promise(resolve => {
            setTimeout(resolve, timeDelay)
        })
    }

    async function navigatePages() {

        for (let i = 0; i < 3; i++) {
            clickNext()
            await delay(2000)
        }
    }

    function clickNext() {
        const nextButton = document.querySelector('nav[aria-label="pagination"] .flex.flex-row-reverse.h-full.w-full.items-center.justify-center[href*="?page="]');

        if (nextButton) {
            nextButton.click()
        }
    }

    navigatePages()

}