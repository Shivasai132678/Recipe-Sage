import Logo from './Logo';

export default function Header() {
  return (
    <header className="py-4 px-4 md:px-6 border-b">
      <div className="container mx-auto flex items-center justify-between">
        <Logo />
      </div>
    </header>
  );
}
