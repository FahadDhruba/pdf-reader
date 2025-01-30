'use client';

import React, { useEffect, useState } from 'react';

export default function Home() {
  const [pdfUrl, setPdfUrl] = useState(null);

  useEffect(() => {
    // Fetch the PDF file from the Next.js API route
    const fetchPdf = async () => {
      try {
        // Fetch the PDF from the API route
        const response = await fetch('/api/getpdf');
        if (!response.ok) {
          throw new Error('Failed to fetch PDF');
        }

        // Convert the response to a Blob
        const pdfBlob = await response.blob();

        // Create a URL for the Blob
        const pdfUrl = URL.createObjectURL(pdfBlob);

        // Set the URL in state
        setPdfUrl(pdfUrl);
      } catch (error) {
        console.error('Error fetching PDF:', error);
      }
    };

    fetchPdf();
  }, []);

  return (
    <main>
      
      <div className="min-h-screen">
        {pdfUrl ? (
          <iframe
            id="pdf-js-viewer"
            src={`/web/viewer.html?file=${encodeURIComponent(pdfUrl)}&printstat=cant`}
            title="webviewer"
            frameBorder="0"
            width="100%"
            height="100%"
            className="h-screen"
          ></iframe>
        ) : (
          <p>লোডিং PDF...</p>
        )}
      </div>
    </main>
  );
}