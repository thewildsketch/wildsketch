import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import HomeView from './components/HomeView';
import ArticlesView from './components/ArticlesView';
import AnnouncementsView from './components/AnnouncementsView';
import AnimalDetailView from './components/AnimalDetailView';
import Footer from './components/Footer';
import { animalsData } from './data/animalsData';
import './App.css';

function parsePath(pathname) {
  if (pathname.startsWith('/animal/')) {
    const id = pathname.replace('/animal/', '');
    return { activeView: 'detail', selectedAnimalId: id || null, activeArticleId: null };
  }
  if (pathname.startsWith('/articles/')) {
    const id = pathname.replace('/articles/', '');
    return { activeView: 'articles', selectedAnimalId: null, activeArticleId: id || null };
  }
  if (pathname === '/articles') {
    return { activeView: 'articles', selectedAnimalId: null, activeArticleId: null };
  }
  if (pathname === '/announcements') {
    return { activeView: 'announcements', selectedAnimalId: null, activeArticleId: null };
  }
  return { activeView: 'home', selectedAnimalId: null, activeArticleId: null };
}

export default function App() {
  const [routeState, setRouteState] = useState(() => parsePath(window.location.pathname));
  const { activeView, selectedAnimalId, activeArticleId } = routeState;

  const navigateTo = (view, animalId = null, articleId = null) => {
    setRouteState({
      activeView: view,
      selectedAnimalId: animalId,
      activeArticleId: articleId
    });

    let path = '/';
    if (view === 'detail' && animalId) {
      path = `/animal/${animalId}`;
    } else if (view === 'articles') {
      path = articleId ? `/articles/${articleId}` : '/articles';
    } else if (view === 'announcements') {
      path = '/announcements';
    }

    if (window.location.pathname !== path) {
      window.history.pushState(null, '', path);
    }
  };

  useEffect(() => {
    const handlePopState = () => {
      setRouteState(parsePath(window.location.pathname));
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleAnimalSelect = (id) => {
    navigateTo('detail', id, null);
  };

  const handleNavigateArticle = (articleId) => {
    navigateTo('articles', null, articleId);
  };

  const selectedAnimal = animalsData.find((a) => a.id === selectedAnimalId && a.status === 'published');

  return (
    <>
      <Header activeView={activeView} onViewChange={(view) => {
        navigateTo(view, null, null);
      }} />
      
      <main>
        {activeView === 'home' && (
          <HomeView animals={animalsData} onAnimalSelect={handleAnimalSelect} />
        )}

        {activeView === 'announcements' && (
          <AnnouncementsView />
        )}
        
        {activeView === 'articles' && (
          <ArticlesView 
            activeArticleId={activeArticleId} 
            onArticleSelect={(articleId) => navigateTo('articles', null, articleId)} 
          />
        )}

        {activeView === 'detail' && selectedAnimal && (
          <AnimalDetailView 
            animal={selectedAnimal} 
            onBack={() => navigateTo('home', null, null)} 
            onNavigateAnimal={(id) => navigateTo('detail', id, null)}
            onNavigateArticle={handleNavigateArticle}
          />
        )}
      </main>

      <Footer />
    </>
  );
}



