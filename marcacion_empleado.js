const { Builder, By } = require('selenium-webdriver')

//Variables de entorno
require('dotenv').config()

let driver = null

const esAntesDeLas12 = () => new Date().getHours() < 12 ? 1 : 2

const login = async () => {

    const option = await driver.findElement(By.xpath(`/html/body/div[1]/div[1]/div/div/div/div/div/div[2]/div/div/div/div[1]/div[2]/div/select/option[${process.env.PAIS}]`))
    await option.click()

    const documentInput = await driver.findElement(By.xpath(`/html/body/div[1]/div[1]/div/div/div/div/div/div[2]/div/div/div/div[1]/div[6]/input`))
    await documentInput.sendKeys(process.env.DOCUMENTO)

    const passwordInput = await driver.findElement(By.xpath(`/html/body/div[1]/div[1]/div/div/div/div/div/div[2]/div/div/div/div[1]/div[9]/input`))
    await passwordInput.sendKeys(process.env.PASSWORD)

    const loginButton = await driver.findElement(By.xpath(`/html/body/div[1]/div[1]/div/div/div/div/div/div[2]/div/div/div/div[2]`))
    await loginButton.click()
}

const marcacion = async () => {
    const buttonMarcacion = await driver.findElement(By.xpath(`/html/body/div[1]/div[2]/div[3]/div[2]/div/div[2]/div/form/div/div[4]/div[${esAntesDeLas12()}]/button`))
    await buttonMarcacion.click()

    setTimeout(async () => {
        const buttonConfirmar = await driver.findElement(By.xpath(`/html/body/div[7]/div[2]/table[2]/tbody/tr/td/table/tbody/tr/td[1]/button`))
        await buttonMarcacion.click()
    }, 1000)
}

const init = async () => {
    driver = await new Builder().forBrowser('chrome').build()

    await driver.get('https://trabajador.relojcontrol.com/login.zul')
    await driver.manage().setTimeouts({ implicit: 1000 })

    login()
    setTimeout(marcacion, 1000)
}

init()