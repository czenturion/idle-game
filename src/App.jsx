import { useEffect } from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import useGameStore from './store/gameStore';
import './App.css';
import Researches from './pages/researches/Researches';
import Quests from './pages/quests/Quests';
import Bosses from './pages/bosses/Bosses';
import ProgressBar from './shared/ui/progressBar/ProgressBar';


function App() {

  useEffect(() => {
    const interval = setInterval(() => {
      useGameStore.getState().tickProgress();
    }, 5);
    return () => clearInterval(interval)
  }, []);

  return <div className="gui">
    <div className="menu">
      <ProgressBar />
      <ul>
        <li>
          <NavLink
            to='/researches'
            className={({ isActive }) => isActive ? 'active-link' : ''}
          >
            Исследования
          </NavLink>
        </li>
        <li>
          <NavLink
            to='/quests'
            className={({ isActive }) => isActive ? 'active-link' : ''}
          >
            Задания
          </NavLink>
        </li>
        <li>
          <NavLink
            to='/bosses'
            className={({ isActive }) => isActive ? 'active-link' : ''}
          >
            Боссы
          </NavLink>
        </li>
      </ul>
    </div>
    <div className="content">
      <Routes>
        <Route path='/researches' element={<Researches />} />
        <Route path='/quests' element={<Quests />} />
        <Route path='/bosses' element={<Bosses />} />
      </Routes>
    </div>
  </div>
}


export default App
