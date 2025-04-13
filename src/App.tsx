import { Route, Routes } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import Home from './pages/home/Home';
import Tree from './pages/tree/Tree';
import Level1 from './pages/level1/Level1';
import Level2 from './pages/level2/Level2.tsx';
import Level3 from './pages/level3/Level3.tsx';
import Level4 from '@/pages/level4/Level4.tsx';
import Level5 from '@/pages/level5/Level5.tsx';
import Level6 from '@/pages/level6/Level6.tsx';
import Level7 from '@/pages/level7/Level7.tsx';
import Level8 from './pages/level8/Level8.tsx';
import Level9 from '@/pages/level9/Level9.tsx';
import Leaderboard from './pages/leaderboard/Leaderboard.tsx';

function App() {
  return (
    <UserProvider>
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tree" element={<Tree />} />
          <Route path="/level1" element={<Level1 />} />
          <Route path="/level2" element={<Level2 />} />
          <Route path="/level3" element={<Level3 />} />
          <Route path="/level4" element={<Level4 />} />
          <Route path="/level5" element={<Level5 />} />
          <Route path="/level6" element={<Level6 />} />
          <Route path="/level7" element={<Level7 />} />
          <Route path="/level8" element={<Level8 />} />
          <Route path="/level9" element={<Level9 />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
        </Routes>
      </div>
    </UserProvider>
  );
}

export default App;
