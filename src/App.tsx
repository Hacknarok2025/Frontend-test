import { Route, Routes } from 'react-router-dom';
import Home from './pages/home/Home';
import Tree from './pages/tree/Tree';

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tree" element={<Tree />} />
      </Routes>
    </div>
  );
}

export default App;
