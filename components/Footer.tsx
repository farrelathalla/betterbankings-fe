export default function Footer() {
  return (
    <footer className="z-10 w-full bg-white py-8 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-[#535769]">
        <p>Copyright © 2024 BetterBankings - All Rights Reserved.</p>
        <div className="flex items-center gap-8">
          <a
            href="/b-foresight"
            className="hover:text-[#14213D] transition-colors"
          >
            B-Foresight
          </a>
          <a
            href="/advisory"
            className="hover:text-[#14213D] transition-colors"
          >
            Advisory
          </a>
          <a
            href="mailto:info@betterbankings.com"
            className="hover:text-[#14213D] transition-colors"
          >
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}
