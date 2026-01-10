import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ResumeProvider } from './context/ResumeContext';
import { Layout } from './components/layout/Layout';
import { Home } from './pages/Home';
import { Analysis } from './pages/Analysis';
import { History } from './pages/History';
import { About } from './pages/About';

import { ThemeProvider } from "@/components/theme-provider"

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <ResumeProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/analysis" element={<Analysis />} />
              <Route path="/history" element={<History />} />
              <Route path="/about" element={<About />} />
            </Routes>
          </Layout>
        </Router>
      </ResumeProvider>
    </ThemeProvider>
  );
}

export default App;
