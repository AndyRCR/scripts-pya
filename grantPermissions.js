const { Builder, By } = require('selenium-webdriver')

//Variables de entorno
require('dotenv').config()

const workers = ['Alex Fuenmayor Beltran', 'Bárbara Zárate Sanhueza', 'Barbara Dominguez Ramirez', 'Carla Montecinos Rojas', 'Claudia Weisse Pinto', 'Daniel Bazán Faúndez', 'Francisco Jimenez', 'Gabriel Sefair Arias', 'Hernan Leiva Torres', 'Marcelo Carmona Concha', 'Mauricio Ulloa Leyton', 'Ruben Gonzalez Saavedra', 'Telmo Gutierrez Baeza']
const permissions = [
    '/html/body/app-root/app-shell/prx-vertical-layout-default/prx-main-body/main/app-asignacion-permisos/div/div/prx-card/tabset/div/tab[1]/prx-card-body/app-modulo-trabajador/form/div/div[2]/prx-card/app-pya-fieldset/fieldset/ngx-datatable/div/datatable-body/datatable-selection/datatable-scroller/datatable-row-wrapper[2]/datatable-body-row/div[2]/datatable-body-cell[1]/div/label/input',
    '/html/body/app-root/app-shell/prx-vertical-layout-default/prx-main-body/main/app-asignacion-permisos/div/div/prx-card/tabset/div/tab[1]/prx-card-body/app-modulo-trabajador/form/div/div[2]/prx-card/app-pya-fieldset/fieldset/ngx-datatable/div/datatable-body/datatable-selection/datatable-scroller/datatable-row-wrapper[3]/datatable-body-row/div[2]/datatable-body-cell[1]/div/label/input'
]

const sleep = ms => {
    return new Promise((resolve) => {
        setTimeout(resolve, ms)
    })
}

const login = async () => {
    sleep(3000)

    const wizzardLoginButton = await driver.findElement(By.xpath(`/html/body/app-root/prx-auth-shell/div/div/div[2]/div/app-login/form/div[2]/prx-button/button`))
    await wizzardLoginButton.click()

    sleep(3000)

    const documentInput = await driver.findElement(By.xpath(`/html/body/div/form[1]/div/div/div[2]/div[1]/div/div/div/div/div[1]/div[3]/div/div/div/div[2]/div[2]/div/input[1]`))
    await documentInput.sendKeys(process.env.EMAIL)

    const nextButton1 = await driver.findElement(By.xpath(`/html/body/div/form[1]/div/div/div[2]/div[1]/div/div/div/div/div[1]/div[3]/div/div/div/div[4]/div/div/div/div/input`))
    await nextButton1.click()

    const passwordInput = await driver.findElement(By.xpath(`/html/body/div/form[1]/div/div/div[2]/div[1]/div/div/div/div/div/div[3]/div/div[2]/div/div[3]/div/div[2]/input`))
    await passwordInput.sendKeys(process.env.EMAIL_PASSWORD)

    const msLoginButton = await driver.findElement(By.xpath(`/html/body/div/form[1]/div/div/div[2]/div[1]/div/div/div/div/div/div[3]/div/div[2]/div/div[4]/div[2]/div/div/div/div/input`))
    await msLoginButton.click()
}

const assignPermissions = async () => {
    sleep(3000)

    const permissionsModuleButton = await driver.findElement(By.xpath(`/html/body/app-root/app-shell/prx-vertical-layout-default/prx-sidenav/div[2]/nav/prx-sidenav-item[5]/nav/prx-sidenav-item[2]/a`))
    await permissionsModuleButton.click()

    sleep(3000)

    const selectBox = await driver.findElement(By.xpath(`/html/body/app-root/app-shell/prx-vertical-layout-default/prx-main-body/main/app-asignacion-permisos/div/div/prx-card/tabset/div/tab[1]/prx-card-body/app-modulo-trabajador/form/div/div[1]/prx-card/app-pya-fieldset/fieldset/div[1]/ng-select/div/div/div[3]/input`))
    const checkBoxes = []

    for (let xpath of permissions) {
        checkBoxes.push(await driver.findElement(By.xpath(xpath)))
    }

    console.log(checkBoxes)

    for (let worker of workers) {
        await selectBox.sendKeys(worker)

        const selectBoxOption = await driver.findElement(By.xpath(`/html/body/app-root/app-shell/prx-vertical-layout-default/prx-main-body/main/app-asignacion-permisos/div/div/prx-card/tabset/div/tab[1]/prx-card-body/app-modulo-trabajador/form/div/div[1]/prx-card/app-pya-fieldset/fieldset/div[1]/ng-select/ng-dropdown-panel/div/div[2]/div`))
        await selectBoxOption.click()
    }
}

const init = async () => {
    driver = await new Builder().forBrowser('chrome').build()

    await driver.get('https://intranet.pya.cl/intranet/login')
    await driver.manage().setTimeouts({ implicit: 3000 })

    login()
    //assignPermissions()
}

init()