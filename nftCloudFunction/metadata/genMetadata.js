const fs = require("fs")
let cnt = 21

for (let i = cnt; i <= 100; i++) {
    metadata = {
        name: `TON Dobby NFT #${i}`,
        description: "Dooby’s antenna, a limited edition trendy accessory.",
        image: "https://drive.google.com/uc?export=download&id=1-tzmU_EYwAkAfVqicDbroKJDLfI-b0EW",
        content_url: "https://drive.google.com/uc?export=download&id=1-tzmU_EYwAkAfVqicDbroKJDLfI-b0EW",
        attributes: []
     }
     fs.writeFileSync(`./${i}.json`, JSON.stringify(metadata, null, 4));
}