"use client"

export default function Home() {
  return (
    <main>
      <div className="min-h-screen">
        <iframe
          id="pdf-js-viewer"
          src="web/viewer.html?file=/hola.pdf"
          title="webviewer"
          frameBorder="0"
          width="100%"
          height="100%"
          className="h-screen"
          
        ></iframe>
      </div>
    </main>
  );
}
