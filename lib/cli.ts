

import yargs from 'yargs';
import { hideBin} from "yargs/helpers";
import * as fs from 'fs'

const applicationInitializer = (appName: string) => {
    console.log(__dirname + appName)
    if (!fs.existsSync(`${__dirname}/../${appName}`)) {
        console.log('create')
        fs.mkdirSync(`${__dirname}/../${appName}`)

        if (fs.existsSync(`${__dirname}/../${appName}`)) {
            fs.mkdirSync(`${__dirname}/../${appName}/entities`)
            fs.mkdirSync(`${__dirname}/../${appName}/controllers`)
            fs.mkdirSync(`${__dirname}/../${appName}/routes`)
            fs.writeFileSync(`${__dirname}/../${appName}/index.ts`,
                fs.readFileSync(`${__dirname}/newAppIndexTemplate.ts`, 'utf-8'))
        }
    }
}

// yargs(hideBin((process.argv)))
//     .command('createapp [appName]', 'Creating application', (yargs: any) => {
//         return yargs
//             .positional('appName', {
//                 describe: 'Your application name'
//             })
//     }, argv => {
//         applicationInitializer(<string>argv.appName)
//     }).argv


const argv = yargs(hideBin(process.argv)).argv
// @ts-ignore
applicationInitializer(argv._)

