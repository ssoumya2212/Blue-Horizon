/**
* main page object containing all methods, selectors and functionality
* that is shared across all page objects
*/
export default class Page {
    /**
    * Opens a sub page of the page
    * @param path path of the sub page (e.g. /path/to/page.html)
    */
    public open (path: string) {
        // Appium handles routing differently, mostly through native interactions
        // but for webviews inside Capacitor we can navigate if needed
        return browser.url(`http://localhost/${path}`)
    }
}
