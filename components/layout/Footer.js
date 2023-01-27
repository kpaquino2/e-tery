export default function Footer({ children }) {
  return (
    <footer className="fixed bottom-0 max-w-[450px] left-1/2 -translate-x-1/2 w-screen bg-maroon h-16">
      {children}
    </footer>
  );
}
