'use client';

import React, { useEffect, useState } from 'react';

export default function Home() {
  const [pdfUrl, setPdfUrl] = useState(null);
  const [progress, setProgress] = useState(0); // State to track progress
  const [isLoading, setIsLoading] = useState(true); // State to track loading status

  useEffect(() => {
    const fetchPdf = async () => {
      try {
        const response = await fetch('/api/getpdf');

        if (!response.ok) {
          throw new Error('Failed to fetch PDF');
        }

        // Get the content length for progress calculation
        const contentLength = response.headers.get('content-length');
        const totalBytes = contentLength ? parseInt(contentLength, 10) : null;

        // Create a reader to read the stream
        const reader = response.body.getReader();
        let receivedBytes = 0;
        let chunks = [];

        while (true) {
          const { done, value } = await reader.read();

          if (done) {
            // Combine all chunks into a single Blob
            const pdfBlob = new Blob(chunks, { type: 'application/pdf' });
            console.log(chunks);
            const pdfUrl = URL.createObjectURL(pdfBlob);
            setPdfUrl(pdfUrl);
            console.log(pdfUrl);
            
            setProgress(100); // Set progress to 100% when done
            setIsLoading(false); // Set loading to false
            break;
          }

          chunks.push(value);
          receivedBytes += value.length;

          // Calculate progress percentage if totalBytes is available
          if (totalBytes) {
            const newProgress = Math.round((receivedBytes / totalBytes) * 100);
            setProgress(newProgress);
          }
        }
      } catch (error) {
        console.error('Error fetching PDF:', error);
        setIsLoading(false); // Set loading to false in case of error
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
            <p>লোডিং PDF...</p>
            {isLoading ? (
              <>
                {/* Show progress bar if totalBytes is available */}
                {progress > 0 && (
                  <div className="w-64 bg-gray-200 rounded-full h-2.5 mt-4">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                )}
                {/* Show indeterminate progress (spinner) if totalBytes is not available */}
                {progress === 0 && (
                  <div className="mt-4">
                    <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
                <p className="mt-2">{progress > 0 ? `${progress}%` : 'Loading...'}</p>
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