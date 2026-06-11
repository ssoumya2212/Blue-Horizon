import fs from "fs";
import path from "path";

async function upload() {
  console.log("Fetching best server...");
  const serversRes = await fetch("https://api.gofile.io/servers");
  const serversData = await serversRes.json();
  const server = serversData.data.servers[0].name;
  console.log("Uploading to server:", server);

  const filePath = path.resolve("./release/Blue Horizon Setup 1.0.0.exe");

  const blob = new Blob([fs.readFileSync(filePath)]);
  const formData = new FormData();
  formData.append("file", blob, "Blue-Horizon-Setup.exe");

  console.log("Starting upload...");
  const uploadRes = await fetch(
    `https://${server}.gofile.io/contents/uploadfile`,
    {
      method: "POST",
      body: formData,
    },
  );

  const uploadData = await uploadRes.json();
  console.log("Upload result:", uploadData);
}

upload().catch(console.error);
