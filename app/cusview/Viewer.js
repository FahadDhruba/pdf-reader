"use client";

import { useEffect, useRef, useState } from "react";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
import * as pdfjsViewer from "pdfjs-dist/web/pdf_viewer";

export default function PDFViewer({ fileUrl }) {
    const containerRef = useRef(null);
    const [loading, setLoading] = useState(true);

    GlobalWorkerOptions.workerSrc = "/build/pdf.worker.mjs";

    const renderPage = async (loadedPdf, num) => {
        const page = await loadedPdf.getPage(num);
        const scale = 1.5;
        const viewport = page.getViewport({ scale });

        // Create a canvas element
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        // Render the PDF page into the canvas
        await page.render({ canvasContext: context, viewport }).promise;

        // Append canvas to container
        containerRef.current.appendChild(canvas);

        // Create a text layer container
        const textLayerDiv = document.createElement("div");
        textLayerDiv.className = "textLayer absolute inset-0 overflow-hidden opacity-60 leading-none";
        containerRef.current.appendChild(textLayerDiv);

        // Create a TextLayerBuilder instance
        const textLayer = new pdfjsViewer.TextLayerBuilder({
            textLayerDiv,
            pageIndex: num - 1,
            viewport,
            eventBus: new pdfjsViewer.EventBus(), // Required for text selection
        });

        // Get text content and render it
        const textContent = await page.getTextContent();
        textLayer.setTextContent(textContent);
        textLayer.render();
    };

    useEffect(() => {
        const loadPDF = async () => {
            try {
                const loadedPdf = await getDocument(fileUrl).promise;

                // Render all pages
                for (let i = 1; i <= loadedPdf.numPages; i++) {
                    await renderPage(loadedPdf, i);
                }

                setLoading(false);
            } catch (error) {
                console.error("Error loading PDF:", error);
            }
        };

        loadPDF();
    }, [fileUrl]);

    return (
        <div className="flex flex-col items-center p-4">
            {loading && <p className="text-lg font-semibold">Loading PDF...</p>}
            <div ref={containerRef} className="pdf-container w-full max-w-4xl space-y-4 relative"></div>
        </div>
    );
}
