import { Outlet } from 'react-router-dom';
import ClerkApiSetup from './ClerkApiSetup';

function Layout() {
  return (
    <ClerkApiSetup>
      <div className="min-h-screen flex flex-col">
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </ClerkApiSetup>
  );
}

export default Layout;
