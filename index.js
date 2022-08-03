require('dotenv').config()
const actions = require('./actions/index.js')

class Main {
    constructor() {
        this.execute()
    }

    parseArgs() {
        const a = process.argv.slice(2)
        const method = a[0]
        const args = a.slice(1)

        return { method, args }
    }

    parseArgsArray(args = {}) {
        if (args.length <= 0) return {}
        if (args.length < 2 || args.length % 2) return args

        const result = {}

        for (let i = 0; i < args.length; i+=2) {
            result[args[i].replace('--', '')] = args[i+1];
        }

        return result
    }

    async execute() {
        const { method, args } = this.parseArgs()
        const options = this.parseArgsArray(args)

        for (let i = 0; i < actions.length; i++) {
            const action = actions[i];

            if (action.name === method) {
                console.log(`Executing ${action.name}: ${action.label}`)
                console.log('Options:', options)

                try {
                    const result = await action.execute(options)
                    console.log(result)
                } catch (err) {
                    console.log(`Action ${action.name} failed ! error:`)
                    console.log(err)
                }
                return
            } else {
                if (actions.length - 1 === i) {
                    console.log(`\nAction ${action.name} not found !`)
                    return
                }
            }
        }

    }
}

new Main()