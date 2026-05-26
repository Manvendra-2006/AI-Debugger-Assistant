import fs from "fs"

export default async function readFile(
    filepath
) {

    try {

        const content =
            fs.readFileSync(
                filepath,
                "utf-8"
            )

        return content

    } catch (err) {

        return err.message
    }
}
