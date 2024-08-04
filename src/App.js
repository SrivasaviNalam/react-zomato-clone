import Home from './components/Home';
import Search from './components/Search';
import Restaurant from './components/Restaurant';
import PageNotFound from './components/PageNotFound';
import { Route, Routes } from 'react-router-dom';

function App() {
  return (
    <main className='container-fluid'>
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/search/:id/:name" element={<Search />}/>
        <Route path="/restaurant-page/:id" element={<Restaurant />}/>
        <Route path="*" element={<PageNotFound />}/>
      </Routes>
    </main>
  );
}

export default App;
