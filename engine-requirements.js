const major = parseInt(process.versions.node.split('.')[0], 10)
if (major < 20) {
  console.error('\n@stain/baileys requires Node.js >= 20. Current version: ' + process.version + '\n')
  process.exit(1)
}
