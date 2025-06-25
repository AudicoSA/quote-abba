
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const quote = await prisma.quote.findUnique({
      where: { id: params.id },
      include: {
        client: true,
        installation: true,
        items: {
          include: {
            equipment: {
              include: {
                category: true
              }
            }
          }
        }
      }
    })

    if (!quote) {
      return NextResponse.json(
        { success: false, error: 'Quote not found' },
        { status: 404 }
      )
    }

    // For now, return a simple PDF placeholder
    // In a real implementation, you would use a PDF generation library like puppeteer or jsPDF
    const pdfContent = generatePDFPlaceholder(quote)
    
    return new NextResponse(pdfContent, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="quote-${quote.quoteNumber}.pdf"`
      }
    })

  } catch (error) {
    console.error('PDF generation error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to generate PDF' },
      { status: 500 }
    )
  }
}

function generatePDFPlaceholder(quote: any): Buffer {
  // This is a placeholder - in a real implementation you would use a proper PDF library
  const pdfHeader = '%PDF-1.4\n'
  const pdfContent = `
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
/Resources <<
/Font <<
/F1 5 0 R
>>
>>
>>
endobj

4 0 obj
<<
/Length 200
>>
stream
BT
/F1 12 Tf
50 750 Td
(Quote #${quote.quoteNumber}) Tj
0 -20 Td
(Client: ${quote.client.name}) Tj
0 -20 Td
(Total: $${quote.total.toFixed(2)}) Tj
0 -20 Td
(Generated: ${new Date().toLocaleDateString()}) Tj
ET
endstream
endobj

5 0 obj
<<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica
>>
endobj

xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000274 00000 n 
0000000526 00000 n 
trailer
<<
/Size 6
/Root 1 0 R
>>
startxref
625
%%EOF`

  return Buffer.from(pdfHeader + pdfContent)
}
