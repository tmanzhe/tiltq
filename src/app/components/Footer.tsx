export default function Footer() {
  return (
    <footer className="py-6 text-center space-y-4">
      <div className="max-w-md mx-auto text-gray-500 text-xs space-y-2 mt-2">
        <p>plz dont report us to riot games</p>
        <p>
          we&apos;re open-source 😲 by{' '}
          <a 
            href="https://twitter.com/tmanzhe" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-red-600 hover:text-red-700"
          >
            @tmanzhe
          </a>
          {' '}© 2025
        </p>
      </div>
    </footer>
  );
}