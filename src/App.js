import { BrowserRouter as Router } from 'react-router-dom';
import HomePage from './HomePage';
import { BoggleProvider } from './BoggleContext';

function App() {
  return (
    <BoggleProvider>
      <Router>
        <HomePage />
      </Router>
    </BoggleProvider>
  );
}

export default App;