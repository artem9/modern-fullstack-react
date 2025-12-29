import mongoose from 'mongoose'

export function initDatabase() {
  mongoose.connection.on('open', () => {
    console.info(
      `successfully connected to database: ${process.env.DATABASE_URL}`,
    )
  })

  const connection = mongoose.connect(process.env.DATABASE_URL)

  return connection
}
