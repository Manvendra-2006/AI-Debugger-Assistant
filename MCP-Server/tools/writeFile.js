import fs from "fs"

export default async function writeFile(
    filepath,
    content
) {

    try {

        fs.writeFileSync(
            filepath,
            content
        )

        return "File updated successfully"

    } catch (err) {

        return err.message
    }
}
