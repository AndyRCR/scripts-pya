const { Builder, By } = require('selenium-webdriver')

//Variables de entorno
require('dotenv').config()

const sleep = ms => {
    return new Promise((resolve) => {
        setTimeout(resolve, ms)
    })
}

const init = async () => {
    const driver = await new Builder().forBrowser('chrome').build()
    const alert = false

    await driver.get('https://webmail.pyaing.cl/intranet/soporte/views/soporte.php')

    const getElement = path => {
        return driver.findElement(By.xpath(path))
    }

    const getElements = selector => {
        return driver.findElements(By.css(selector))
    }

    const usernameInput = await getElement(`/html/body/div/div[7]/div/div[2]/div[2]/div[4]/form/table/tbody/tr[1]/td/input`)
    await usernameInput.sendKeys(process.env.INTRANET_USERNAME)

    const passwordInput = await getElement(`/html/body/div/div[7]/div/div[2]/div[2]/div[4]/form/table/tbody/tr[2]/td/input`)
    await passwordInput.sendKeys(process.env.INTRANET_PASSWORD)

    const loginButton = await getElement(`/html/body/div/div[7]/div/div[2]/div[2]/div[4]/form/table/tbody/tr[3]/td[2]/input`)
    await loginButton.click()

    driver.executeAsyncScript("location.href = 'https://webmail.pyaing.cl/intranet/soporte/views/soporte.php'")

    sleep(3000)

    const santiagoTickets = await getElements(`#esperaContainer .col-12.p-0.d-flex.flex-row`)
    const concepcionTickets = await getElements(``)


    console.log(santiagoTickets.length)
}

init()