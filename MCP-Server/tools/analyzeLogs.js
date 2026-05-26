export default async function analyzeLogs(
    logs
) {

    try {

        const lower =
            logs.toLowerCase()

        if (
            lower.includes(
                "module not found"
            )
        ) {

            return `
Missing dependency detected.

Possible fixes:
- npm install
- check import path
`
        }

        if (
            lower.includes(
                "unexpected token"
            )
        ) {

            return `
Syntax error detected.

Check:
- missing bracket
- invalid JSX
- invalid JSON
`
        }

        if (
            lower.includes(
                "failed to fetch"
            )
        ) {

            return `
Network/API issue detected.

Check:
- backend running
- CORS
- API URL
`
        }

        return `
No specific issue detected.
Review logs manually.
`

    } catch (err) {

        return err.message
    }
}
