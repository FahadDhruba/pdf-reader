import PDFViewer from "./Viewer";

export default function ViewHome() {
    return (
        <main>
            <div className="flex flex-col items-center">
                <h1 className="text-xl font-bold my-4">PDF Viewer</h1>
                <PDFViewer fileUrl="/hola.pdf" />
            </div>
        </main>
    );
}
