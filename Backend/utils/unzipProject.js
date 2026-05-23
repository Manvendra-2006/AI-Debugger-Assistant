import AdmZip from "adm-zip";
const unzipProject = (
    zipPath, // atual zip file path
    extractPath // zip ka extract path ko khah store karna hain 
) => {

    const zip = new AdmZip(zipPath) // zip object create , zip file ko read/open karo 

    zip.extractAllTo( // ZIP ke saare files extractPath me extract karo
        extractPath, 
        true // yadi same filename hain exists toh overwrite kar do 
    )
}

export default unzipProject