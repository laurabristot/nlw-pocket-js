import fastify from "fastify"
// biome-ignore lint/style/useImportType: <explanation>
import { ZodTypeProvider, serializerCompiler, validatorCompiler } from "fastify-type-provider-zod"
import z from "zod"
import { createGoal } from "../functions/create-goal"
import { createGoalCompletion } from "../functions/create-goal-completion"
import { getWeekPendingGoals } from "../functions/get-week-pending-goals"

const port = 3333
const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.get('/pending-goals', async () => {
  const {pendingGoals} = await getWeekPendingGoals()
  return {pendingGoals}
})

app.post('/goals', {
  schema: {
    body: z.object({
      title: z.string(),
      desiredWeeklyFrequency: z.number().int().min(1).max(7)
    })
  }
},async (request)=>{
  const {desiredWeeklyFrequency,title} = request.body

  await createGoal({
    title,
    desiredWeeklyFrequency
  })
})


app.post('/goal-completion', {
  schema: {
    body: z.object({
      goalId: z.string()
    })
  }
},async (request)=>{
  const {goalId} = request.body

  await createGoalCompletion({
    goalId
  })
})


app.listen({
  port: port,
}).then(() =>{
  console.log(`HTTP server listening on port: ${port}`)
})