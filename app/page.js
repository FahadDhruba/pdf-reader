'use client';

import React, { useEffect, useState } from 'react';

export default function Home() {
  const [pdfUrl, setPdfUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // State to track loading status

  useEffect(() => {
    const fetchPdf = async () => {
      try {
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
      } finally {
        setIsLoading(false); // Set loading to false when done (success or error)
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
          <div className="flex flex-col items-center justify-center h-screen">
            {isLoading ? (
              <>
                {/* Show loading spinner */}
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-2">লোডিং PDF...</p>
              </>
            ) : (
              <p>Failed to load PDF.</p>
            )}
          </div>
        )}
      </div>
    </main>
  );
}