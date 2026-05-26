import fs from "fs"
import path from "path"

function searchRecursive(
    dir,
    keyword,
    results = []
) {

    const ignoreFolders = [
        "node_modules",
        ".git",
        "dist",
        "build",
        ".next"
    ]

    const items =
        fs.readdirSync(dir)

    for (const item of items) {

        const fullPath =
            path.join(dir, item)

        const stats =
            fs.statSync(fullPath)

        if (
            stats.isDirectory()
        ) {

            if (
                ignoreFolders.includes(item)
            ) continue

            searchRecursive(
                fullPath,
                keyword,
                results
            )

        } else {

            try {

                const content =
                    fs.readFileSync(
                        fullPath,
                        "utf-8"
                    )

                if (
                    content.includes(keyword)
                ) {

                    results.push(fullPath)
                }

            } catch (_) {}
        }
    }

    return results
}



export default async function searchCodebase(
    directoryPath,
    keyword
) {

    try {

        const results =
            searchRecursive(
                directoryPath,
                keyword
            )

        return JSON.stringify(
            results,
            null,
            2
        )

    } catch (err) {

        return err.message
    }
}
