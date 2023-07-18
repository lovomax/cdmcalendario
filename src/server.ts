import app from './app'

app.listen(process.env.SERVER || 3333, () => console.log(`Running on port ${process.env.SERVER || 3333}`))
