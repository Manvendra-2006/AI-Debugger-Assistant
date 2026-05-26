import fs from "fs"
import path from "path"

export default async function listFiles(
    directorypath
) {

    try {

        const items =
            fs.readdirSync(directorypath)

        const result = []

        for (const item of items) {

            const fullPath =
                path.join(
                    directorypath,
                    item
                )

            const stats =
                fs.statSync(fullPath)

            result.push({
                name: item,
                type: stats.isDirectory()
                    ? "folder"
                    : "file"
            })
        }

        return JSON.stringify(
            result,
            null,
            2
        )

    } catch (err) {

        return err.message
    }
}
