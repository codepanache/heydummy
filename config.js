module.exports = {
    ggApiKey: process.env.GG_API_KEY || ENV['ggapi'],
    ggCx: process.env.GG_CX || ENV['ggcx'],
    discordToken: process.env.DT || ENV['dt']
  }