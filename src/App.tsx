import { Route, Routes } from 'react-router-dom';
import Home from './pages/home/Home';
import Tree from './pages/tree/Tree';
import Level1 from './pages/level1/Level1';
import Level8 from './pages/level8/Level8';

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tree" element={<Tree />} />



        <Route path="/level1" element={<Level1 />} />
        <Route path="/level8" element={<Level8 />} />
      </Routes>
    </div>
  );
}

export default App;
