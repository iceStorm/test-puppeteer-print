import puppeteer, { Browser, PDFOptions } from 'puppeteer'

function generatePdfFromHtmlFactory() {
  let browser: Browser

  const createPdf = async function (html: string, type: 'buffer' | 'stream', options: PDFOptions) {
    if (!browser) {
      console.log('A new puppeteer browser is being created...')
      browser = await puppeteer.launch({ headless: 'new' })
    }

    const page = await browser.newPage()
    await page.setContent(html)

    if (type === 'buffer') {
      const buffer = await page.pdf(options)
      await page.close()
      return buffer
    }

    const stream = await page.createPDFStream(options)
    stream.on('close', async () => {
      await page.close()
    })

    return stream
  }

  /**
   * Accept an HTML string as input. Returns a PDF file as a stream or buffer.
   * @param html An HTML string.
   * @param options PDF options like paper size, margin, etc.
   */
  return (html: string, options: PDFOptions) => ({
    toBuffer() {
      return createPdf(html, 'buffer', options)
    },

    toStream() {
      return createPdf(html, 'stream', options)
    },
  })
}

export const generatePdfFromHtml = generatePdfFromHtmlFactory()
