import { defineEventHandler, readBody } from 'h3'
import { callRagPipeline } from './callRagPipeline'

export default defineEventHandler(async (event) => {
  const { question } = await readBody(event)
  const result = await callRagPipeline(question)
  return result
})
