import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import { generatePdfFromHtml } from './utils'

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  context.log('HTTP trigger function processed a request.')

  const { html, options } = req.body

  const pdf = await generatePdfFromHtml(html, options).toBuffer()

  context.res = {
    status: 200 /* Defaults to 200 */,
    body: pdf,
  }
}

export default httpTrigger
