import AboutMe from '@/app/_components/AboutMe';
import Banner from '@/app/_components/Banner';
import DemoLab from '@/app/_components/DemoLab';
import Experiences from '@/app/_components/Experiences';
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
      <DemoLab />
      <ScrollToTopButton trigger={{ type: 'element', id: 'banner' }} />
    </div>
  );
}
