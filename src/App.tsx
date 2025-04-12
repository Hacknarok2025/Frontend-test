import { Route, Routes } from 'react-router-dom';
import Home from './pages/home/Home';
import Tree from './pages/tree/Tree';
import Level1 from './pages/level1/Level1';

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tree" element={<Tree />} />
        <Route path="/level1" element={<Level1 />} />
      </Routes>
    </div>
  );
}

export default App;
