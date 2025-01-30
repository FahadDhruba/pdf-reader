export async function GET() {
    try {
      // URL of the external PDF
      const pdfUrl = 'https://asgcompressednote.com/note/wp-content/uploads/2024/05/%E0%A6%AD%E0%A7%87%E0%A6%95%E0%A7%8D%E0%A6%9F%E0%A6%B0.pdf';
  
      // Fetch the PDF from the external domain
      const response = await fetch(pdfUrl);
  
      if (!response.ok) {
        throw new Error(`Failed to fetch PDF: ${response.statusText}`);
      }
  
      // Get the PDF as a Blob
      const pdfBlob = await response.blob();
  
      // Convert the Blob to a Buffer
      const pdfBuffer = await pdfBlob.arrayBuffer();
  
      // Return the PDF as a response
      return new Response(Buffer.from(pdfBuffer), {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'inline; filename="downloaded.pdf"',
        },
      });
    } catch (error) {
      console.error('Error fetching PDF:', error);
      return new Response(JSON.stringify({ error: 'Failed to fetch PDF' }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
  }