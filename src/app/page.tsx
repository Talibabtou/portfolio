import AboutMe from '@/app/_components/AboutMe';
import Banner from '@/app/_components/Banner';
import Experiences from '@/app/_components/Experiences';
import LazyDemoLab from '@/app/_components/LazyDemoLab';
import Skills from '@/app/_components/Skills';
import ProjectList from '@/app/_components/ProjectList';
import ScrollToTopButton from '@/components/ScrollToTopButton';

export default function Home() {
  return (
    <div>
      <Banner />
      <AboutMe />
      <Experiences />
      <Skills />
      <ProjectList />
      <LazyDemoLab />
      <ScrollToTopButton trigger={{ type: 'element', id: 'banner' }} />
    </div>
  );
}
