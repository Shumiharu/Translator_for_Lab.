import ReactDOM from 'react-dom/client';
import { App } from './App';
import { MemberProvider } from './providers/MemberProvider';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <MemberProvider> 
     <App />
  </MemberProvider>
);

